import mongoose, { Schema, Document } from "mongoose";

// Interface for OrderItem
export interface IOrderItem extends Document {
  productId: string;
  quantity: number;
}

// Interface for Order
export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
}

const orderItemSchema: Schema<IOrderItem> = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema: Schema<IOrder> = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", orderSchema);
