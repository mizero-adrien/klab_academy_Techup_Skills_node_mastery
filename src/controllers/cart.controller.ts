import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cart.service";

export const getCartHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  try {
    const cart = await getCart(userId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
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

  try {
    const cart = await updateCartItem(userId, productId, quantity);
    if (!cart) {
      return res.status(404).json({ message: "Cart or item not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

export const removeItemHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const productId = String(req.params.productId);

  try {
    const cart = await removeCartItem(userId, productId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove cart item" });
  }
};

export const clearCartHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  try {
    await clearCart(userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
