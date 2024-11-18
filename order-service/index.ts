import express, { Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import orderRoutes from "./routes/order";

const PORT: string | number = process.env.PORT || 5003;

dotenv.config();
const app: Application = express();

app.use(express.json());

// Simple request logger middleware
// UNIQUE_CHANGE_FOR_COMMIT_37
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// routes
app.use("/api/orders", orderRoutes);

const mongoURI: string = process.env.MONGO_URI || "";

if (!mongoURI) {
  console.error("🚫 MONGO_URI is not defined in environment variables.");
  process.exit(1); // Exit if MONGO_URI is not set
}

mongoose
  .connect(mongoURI, {
    // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
    // If using an older version, you might need to add them back or use Mongoose.ConnectOptions
  })
  .then(() => {
    console.log("✅ Order Service is Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err: any) => { // Added type for err
    console.error("🚫 Failed to connect to MongoDB -> Order Service", err);
  });
