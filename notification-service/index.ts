import express, { Application } from "express";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notification";

dotenv.config();

const app: Application = express();
app.use(express.json());

// routes
app.use("/api/notification", notificationRoutes);

const PORT: string | number = process.env.PORT || 5005;

app.listen(PORT, () =>
  console.log(`Notification Service running on port ${PORT}`)
);
