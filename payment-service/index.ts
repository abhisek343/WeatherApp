import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment";

const PORT: string | number = process.env.PORT || 5004;

dotenv.config();
const app: Application = express();
app.use(express.json());

// routes
app.use("/api/payments", paymentRoutes);

const mongoURI: string = process.env.MONGO_URI || "";

if (!mongoURI) {
  console.error("🚫 MONGO_URI is not defined in environment variables for Payment Service.");
  process.exit(1); // Exit if MONGO_URI is not set
}

mongoose
  .connect(mongoURI, {
    // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
  })
  .then(() => {
    console.log("✅ Payment Service is Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Payment Service running on port ${PORT}`)
    );
  })
  .catch((err: any) => {
    console.error("🚫 Failed to connect to MongoDB -> Payment Service", err);
  });
