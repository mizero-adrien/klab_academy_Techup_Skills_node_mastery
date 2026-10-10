import { z } from "zod";
import { objectId } from "./common.schema";

const quantity = z
  .number("Quantity must be a number")
  .int("Quantity must be a whole number")
  .min(1, "Quantity must be at least 1")
  .max(100, "Quantity cannot be more than 100");

export const addToCartSchema = z.object({
  productId: objectId("productId"),
  quantity,
});

export const updateCartItemSchema = z.object({
  quantity,
});