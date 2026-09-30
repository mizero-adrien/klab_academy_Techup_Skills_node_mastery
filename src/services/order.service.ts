import { Order, IOrder } from "../models/order.model";
import { Cart } from "../models/cart.model";

export const createOrderFromCart = async (userId: string): Promise<IOrder> => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderItems = cart.items.map((item) => {
    const product = item.product as any;
    return {
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
  });

  cart.items = [];
  await cart.save();

  return order;
};

export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  return Order.find({ user: userId }).populate("items.product");
};

export const cancelOrder = async (
  userId: string,
  orderId: string
): Promise<IOrder | null> => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) return null;

  if (order.status !== "pending") {
    throw new Error("Only pending orders can be cancelled");
  }

  order.status = "cancelled";
  await order.save();
  return order;
};

export const getOrderById = async (
  userId: string,
  orderId: string
): Promise<IOrder | null> => {
  return Order.findOne({ _id: orderId, user: userId }).populate("items.product");
};