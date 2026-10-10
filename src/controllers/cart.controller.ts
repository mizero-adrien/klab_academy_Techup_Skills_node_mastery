import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "../services/cart.service";

export const getCartHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const cart = await getCart(userId);
  res.json(cart);
};

export const addItemHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await addItemToCart(userId, productId, quantity);
    res.status(201).json(cart);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to add item to cart" });
  }
};

export const updateItemHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const productId = String(req.params.productId);
  const { quantity } = req.body;

  const cart = await updateCartItem(userId, productId, quantity);
  if (!cart) {
    return res.status(404).json({ message: "Cart or item not found" });
  }
  res.json(cart);
};

export const removeItemHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const productId = String(req.params.productId);

  const cart = await removeCartItem(userId, productId);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  res.json(cart);
};
