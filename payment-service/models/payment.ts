import mongoose, { Schema, Document } from "mongoose";

// Interface for Payment
export interface IPayment extends Document {
  orderId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentDate: Date;
}

const paymentSchema: Schema<IPayment> = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true }, // e.g., "Pending", "Completed", "Failed"
  paymentMethod: { type: String, required: true }, // e.g., "Credit Card", "PayPal"
  paymentDate: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>("Payment", paymentSchema);
