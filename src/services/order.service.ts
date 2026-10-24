import mongoose, { Types } from "mongoose";
import { Order, IOrder } from "../models/order.model";
import { Product } from "../models/product.model";
import { sendEmail } from "../utils/sendEmail";
import { orderConfirmationTemplate } from "../templates/orderConfirmation.template";

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

type OrderInputItem = { productId: string; quantity: number };

type DeliveryInput = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
};

type PreparedOrderItem = {
  product: Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  productImage?: string;
};

type DecrementStep = {
  productId: string;
  quantity: number;
};

type PreparedOrderData = {
  items: PreparedOrderItem[];
  totalAmount: number;
};

export type AdminOrderListParams = {
  status?: OrderStatus;
  page: number;
  limit: number;
  query?: string;
};

export type AdminOrderListResult = {
  items: IOrder[];
  total: number;
  page: number;
  limit: number;
  statusCounts: Record<OrderStatus, number>;
  totalRevenue: number;
  pendingOrders: number;
};

export class OrderServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const isOrderStatus = (value: string): value is OrderStatus => {
  return ORDER_STATUSES.includes(value as OrderStatus);
};

const normalizeItems = (items: OrderInputItem[]): OrderInputItem[] => {
  const mergedItems = new Map<string, number>();
  for (const item of items) {
    const current = mergedItems.get(item.productId) ?? 0;
    mergedItems.set(item.productId, current + item.quantity);
  }

  return Array.from(mergedItems.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

const buildPreparedOrder = async (
  items: OrderInputItem[],
  session?: mongoose.ClientSession
): Promise<PreparedOrderData> => {
  const uniqueItems = normalizeItems(items);
  const productIds = uniqueItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).session(session ?? null);

  if (!products || products.length === 0) {
    throw new OrderServiceError("No valid products found", 400);
  }

  const productMap = new Map(products.map((p) => [String(p._id), p]));

  for (const item of uniqueItems) {
    if (!productMap.has(item.productId)) {
      throw new OrderServiceError(`Product with ID ${item.productId} not found`, 400);
    }
  }

  const orderItems: PreparedOrderItem[] = uniqueItems.map((item) => {
    const product = productMap.get(item.productId)!;
    return {
      product: product._id as Types.ObjectId,
      quantity: item.quantity,
      priceAtPurchase: product.price,
      productName: product.name,
      productImage: product.imageUrl,
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  return { items: orderItems, totalAmount };
};

const decrementStockWithRollback = async (
  orderItems: PreparedOrderItem[],
  session?: mongoose.ClientSession
) => {
  const decremented: DecrementStep[] = [];

  for (const item of orderItems) {
    const productId = String(item.product);
    const updateQuery = Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (session) {
      updateQuery.session(session);
    }

    const result = await updateQuery;

    if (result.modifiedCount === 0) {
      if (!session) {
        for (const restored of decremented) {
          await Product.updateOne(
            { _id: restored.productId },
            { $inc: { stock: restored.quantity } }
          );
        }
      }

      const currentProduct = await Product.findById(productId).session(session ?? null);
      const currentStock = currentProduct?.stock ?? 0;
      const name = currentProduct?.name ?? item.productName;
      throw new OrderServiceError(
        `Insufficient stock for ${name}. Requested ${item.quantity}, available ${currentStock}.`,
        409
      );
    }

    decremented.push({ productId, quantity: item.quantity });
  }

  return decremented;
};

const restoreStock = async (steps: DecrementStep[]) => {
  for (const step of steps) {
    await Product.updateOne({ _id: step.productId }, { $inc: { stock: step.quantity } });
  }
};

const isTransactionUnavailableError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const text = error.message.toLowerCase();
  return (
    text.includes("transaction numbers are only allowed") ||
    text.includes("replica set") ||
    text.includes("does not support transactions")
  );
};

const createOrderWithoutTransaction = async (
  userId: string,
  userName: string,
  userEmail: string,
  prepared: PreparedOrderData,
  delivery: DeliveryInput,
  paymentMethod: "momo" | "cash"
): Promise<IOrder> => {
  const decremented = await decrementStockWithRollback(prepared.items);

  try {
    const order = await Order.create({
      user: userId,
      userName,
      userEmail,
      items: prepared.items,
      totalAmount: prepared.totalAmount,
      delivery,
      paymentMethod,
    });
    return order;
  } catch (error) {
    await restoreStock(decremented);
    throw error;
  }
};

export const createOrder = async (
  userId: string,
  userName: string,
  userEmail: string,
  items: OrderInputItem[],
  delivery: DeliveryInput,
  paymentMethod: "momo" | "cash"
): Promise<IOrder> => {
  const prepared = await buildPreparedOrder(items);
  let order: IOrder | null = null;

  try {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const inTxPrepared = await buildPreparedOrder(items, session);
        await decrementStockWithRollback(inTxPrepared.items, session);

        const created = await Order.create(
          [
            {
              user: userId,
              userName,
              userEmail,
              items: inTxPrepared.items,
              totalAmount: inTxPrepared.totalAmount,
              delivery,
              paymentMethod,
            },
          ],
          { session }
        );
        order = created[0];
      });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    if (error instanceof OrderServiceError) {
      throw error;
    }
    if (!isTransactionUnavailableError(error)) {
      throw error;
    }

    // Fallback for standalone Mongo deployments where transactions are unavailable.
    order = await createOrderWithoutTransaction(
      userId,
      userName,
      userEmail,
      prepared,
      delivery,
      paymentMethod
    );
  }

  if (!order) {
    throw new OrderServiceError("Failed to create order", 500);
  }

  // A broken email must never fail an order that is already saved.
  try {
    const reference = String(order._id).slice(-8).toUpperCase();
    const html = orderConfirmationTemplate({
      name: userName,
      orderId: String(order._id),
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
      totalAmount: order.totalAmount,
      delivery: {
        address: order.delivery.address,
        city: order.delivery.city,
        phone: order.delivery.phone,
      },
      paymentMethod: order.paymentMethod,
    });

    sendEmail(userEmail, `Order ${reference} confirmed`, html).catch((error) => {
      console.error("Order confirmation email failed, but order succeeded:", error);
    });
  } catch (error) {
    console.error("Order confirmation email failed, but order succeeded:", error);
  }

  return order;
};

export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("items.product");
};

export const cancelOrder = async (
  userId: string,
  orderId: string
): Promise<IOrder | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }

  const existing = await Order.findOne({ _id: orderId, user: userId });
  if (!existing) return null;

  if (existing.status === "cancelled") {
    throw new OrderServiceError("Order is already cancelled", 409);
  }

  if (existing.status === "delivered") {
    throw new OrderServiceError("Delivered orders cannot be cancelled", 409);
  }

  const order = await Order.findOneAndUpdate(
    { _id: orderId, user: userId, status: { $nin: ["cancelled", "delivered"] } },
    { status: "cancelled" },
    { new: true }
  );

  if (!order) {
    throw new OrderServiceError("Order status changed. Please refresh and try again.", 409);
  }

  for (const item of order.items) {
    await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
  }

  return order.populate("items.product");
};

export const getOrderById = async (
  userId: string,
  orderId: string
): Promise<IOrder | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }
  return Order.findOne({ _id: orderId, user: userId }).populate("items.product");
};

// Admin functions
export const getAllOrders = async (
  params: AdminOrderListParams
): Promise<AdminOrderListResult> => {
  const { status, page, limit, query } = params;
  const filter: Record<string, unknown> = {};

  if (status) {
    filter.status = status;
  }

  const trimmed = query?.trim();
  if (trimmed) {
    const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const searchFilter: Record<string, unknown>[] = [
      { userName: regex },
      { userEmail: regex },
    ];
    if (Types.ObjectId.isValid(trimmed)) {
      searchFilter.push({ _id: new Types.ObjectId(trimmed) });
    }
    filter.$or = searchFilter;
  }

  const [items, total, grouped, revenueRow] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("items.product"),
    Order.countDocuments(filter),
    Order.aggregate<{ _id: OrderStatus; count: number }>([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Order.aggregate<{ _id: null; totalRevenue: number }>([
      {
        $match: {
          ...filter,
          status: { $ne: "cancelled" },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const statusCounts: Record<OrderStatus, number> = {
    pending: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  for (const row of grouped) {
    if (isOrderStatus(row._id)) {
      statusCounts[row._id] = row.count;
    }
  }

  const totalRevenue = revenueRow[0]?.totalRevenue ?? 0;
  const pendingOrders = statusCounts.pending;

  return { items, total, page, limit, statusCounts, totalRevenue, pendingOrders };
};

export const getOrderByIdAdmin = async (orderId: string): Promise<IOrder | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }
  return Order.findById(orderId).populate("items.product");
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus
): Promise<IOrder | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }

  const order = await Order.findById(orderId);
  if (!order) return null;

  const currentStatus = order.status;
  const allowed = ALLOWED_TRANSITIONS[currentStatus as OrderStatus] ?? [];

  if (currentStatus === newStatus) {
    return order.populate("items.product");
  }

  if (!allowed.includes(newStatus)) {
    throw new OrderServiceError(
      `Cannot change status from ${currentStatus} to ${newStatus}. Allowed: ${allowed.join(", ")}`
      ,
      400
    );
  }

  if (newStatus === "cancelled" && currentStatus !== "cancelled") {
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
  }

  order.status = newStatus;
  await order.save();
  return order.populate("items.product");
};