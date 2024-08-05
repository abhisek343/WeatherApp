import mongoose, { Schema, Document } from "mongoose";

// Interface for CartItem
export interface ICartItem extends Document { // Or just a plain object if not a subdocument with its own _id
  productId: string;
  quantity: number;
}

// Interface for Cart
export interface ICart extends Document {
  userId: string;
  items: ICartItem[]; // This will be an array of subdocuments or objects
}

const cartItemSchema: Schema<ICartItem> = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema: Schema<ICart> = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Assuming one cart per user
  items: [cartItemSchema], // Corrected to be an array of cartItemSchema
});

export default mongoose.model<ICart>("Cart", cartSchema);
