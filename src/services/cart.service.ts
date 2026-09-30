//full crud + population

import { Cart, ICart } from "../models/cart.model";

export const getCart = async (userId: string): Promise<ICart | null> => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate("items.product");
  }
  return cart;
};

export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart> => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId as any, quantity });
  }

  await cart.save();
  return cart.populate("items.product");
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) return null;

  item.quantity = quantity;
  await cart.save();
  return cart.populate("items.product");
};

export const removeCartItem = async (
  userId: string,
  productId: string
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  return cart.populate("items.product");
};