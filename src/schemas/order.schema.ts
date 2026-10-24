import { z } from "zod";

const deliverySchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100, "Full name must be at most 100 characters"),
  phone: z.string().trim().min(9, "Phone number must be at least 9 digits").max(13, "Phone number must be at most 13 digits"),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(200, "Address must be at most 200 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(50, "City must be at most 50 characters"),
});

const orderItemSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item").max(50, "Order cannot contain more than 50 items"),
  delivery: deliverySchema,
  paymentMethod: z.enum(["momo", "cash"]),
});

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
}).refine((data) => {
  // This validation will be done in the service with the current status
  return true;
});
