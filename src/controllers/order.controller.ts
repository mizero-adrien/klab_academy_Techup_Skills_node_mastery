import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createOrderFromCart,
  getUserOrders,
  getOrderById,
  cancelOrder,
} from "../services/order.service";

export const checkoutHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const order = await createOrderFromCart(userId);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Checkout failed" });
  }
};

export const listOrdersHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const orders = await getUserOrders(userId);
  res.json(orders);
};

export const getOrderHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const orderId = String(req.params.id);

  const order = await getOrderById(userId, orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(order);
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
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Cancel failed" });
  }
};