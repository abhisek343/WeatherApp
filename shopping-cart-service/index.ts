import express, { Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cartRoutes from "./routes/cart";

const PORT: string | number = process.env.PORT || 5002;

dotenv.config();
const app: Application = express();

app.use(express.json());

// routes
app.use("/api/cart", cartRoutes);

const mongoURI: string = process.env.MONGO_URI || "";

if (!mongoURI) {
  console.error("🚫 MONGO_URI is not defined in environment variables for Shopping Cart Service.");
  process.exit(1); // Exit if MONGO_URI is not set
}

mongoose
  .connect(mongoURI, {
    // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
  })
  .then(() => {
    console.log("✅ Shopping Cart Service is Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })
  .catch((error: any) => { // Added type for error
    console.error(
      "🚫 Failed to connect to MongoDB -> Shopping Cart Service",
      error
    );
  });
