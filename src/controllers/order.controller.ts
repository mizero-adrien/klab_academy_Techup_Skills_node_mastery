import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  isOrderStatus,
  OrderServiceError,
} from "../services/order.service";
import { User } from "../models/user.model";

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
};

const toStatusCode = (error: unknown, fallback = 500) => {
  if (error instanceof OrderServiceError) {
    return error.statusCode;
  }
  return fallback;
};

const toMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export const createOrderHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { items, delivery, paymentMethod } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await createOrder(userId, user.name, user.email, items, delivery, paymentMethod);
    res.status(201).json(order);
  } catch (error) {
    res
      .status(toStatusCode(error, 500))
      .json({ message: toMessage(error, "Failed to create order") });
  }
};

export const listOrdersHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  try {
    const orders = await getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrderHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const orderId = String(req.params.id);

  try {
    const order = await getOrderById(userId, orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const cancelOrderHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const orderId = String(req.params.id);

  try {
    const order = await cancelOrder(userId, orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(toStatusCode(error, 500)).json({ message: toMessage(error, "Cancel failed") });
  }
};

// Admin handlers
export const listAllOrdersHandler = async (req: AuthRequest, res: Response) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const query = typeof req.query.q === "string" ? req.query.q : undefined;
  const page = parsePositiveInt(req.query.page, 1);
  const limit = Math.min(parsePositiveInt(req.query.limit, 20), 100);

  try {
    if (status !== undefined && !isOrderStatus(status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    const result = await getAllOrders({ status, page, limit, query });
    res.json(result);
  } catch (error) {
    res
      .status(toStatusCode(error, 500))
      .json({ message: toMessage(error, "Failed to fetch orders") });
  }
};

export const getOrderAdminHandler = async (req: AuthRequest, res: Response) => {
  const orderId = String(req.params.id);

  try {
    const order = await getOrderByIdAdmin(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const updateOrderStatusHandler = async (req: AuthRequest, res: Response) => {
  const orderId = String(req.params.id);
  const { status } = req.body;

  try {
    const order = await updateOrderStatus(orderId, status);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res
      .status(toStatusCode(error, 500))
      .json({ message: toMessage(error, "Failed to update order status") });
  }
};