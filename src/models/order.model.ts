import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  productImage?: string;
}

export interface IDelivery {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  userName: string;
  userEmail: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  delivery: IDelivery;
  paymentMethod: "momo" | "cash";
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true, min: 0 },
    productName: { type: String, required: true },
    productImage: { type: String },
  },
  { _id: false }
);

const deliverySchema = new Schema<IDelivery>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    delivery: { type: deliverySchema, required: true },
    paymentMethod: {
      type: String,
      enum: ["momo", "cash"],
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
export const Order = model<IOrder>("Order", orderSchema);