import mongoose, { Schema, Document } from "mongoose";

// Interface for Product
export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
}

const productSchema: Schema<IProduct> = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
});

export default mongoose.model<IProduct>("Product", productSchema);
