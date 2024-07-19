import express, { Router, Request, Response } from "express";
import Order, { IOrder, IOrderItem } from "../models/order"; // Assuming IOrderItem is also exported or defined here for items
import axios, { AxiosResponse } from "axios";

const router: Router = express.Router();

const PRODUCT_SERVICE_URI: string =
  process.env.PRODUCT_SERVICE_URI || "http://localhost:5001";

interface ProductData {
  // Define a more specific type if the product structure is known
  _id: string;
  name: string;
  stock: number;
  // Add other product fields as necessary
}

interface OrderRequestBody {
  items: IOrderItem[]; // Re-using IOrderItem from model, assuming it fits
  totalAmount: number;
}

interface UpdateStatusBody {
  status: string;
}

// Place a new order
router.post("/:userId", async (req: Request<{ userId: string }, any, OrderRequestBody>, res: Response) => {
  const { userId } = req.params;
  const { items, totalAmount } = req.body;

  try {
    // Check if products are available
    const productChecksPromises = items.map(async (item: IOrderItem) => {
      try {
        const response: AxiosResponse<ProductData> = await axios.get(
          `${PRODUCT_SERVICE_URI}/api/products/${item.productId}`
        );
        return response.data && response.data.stock >= item.quantity;
      } catch (error) {
        console.error(`Error fetching product ${item.productId}:`, error);
        return false; // Assume unavailable if product service call fails
      }
    });

    const productChecksResults = await Promise.all(productChecksPromises);

    if (productChecksResults.includes(false)) {
      return res.status(400).json({ msg: "One or more items are out of stock or product service error" });
    }

    // Create new order
    const order: IOrder = new Order({
      userId,
      items,
      totalAmount,
      status: "Pending", // Explicitly set default status if not in body
    });

    await order.save();

    // Deduct product stock
    const deductStockPromises = items.map(async (item: IOrderItem) => {
      try {
        await axios.put(
          `${PRODUCT_SERVICE_URI}/api/products/${item.productId}/deduct`,
          {
            quantity: item.quantity,
          }
        );
      } catch (error) {
        console.error(`Error deducting stock for product ${item.productId}:`, error);
        // Decide on error handling: proceed, rollback, or flag
      }
    });
    await Promise.all(deductStockPromises);


    res.status(201).json(order);
  } catch (err: any) {
    console.error("Error placing order:", err);
    res.status(500).send("Server error");
  }
});

// Get all orders for a user
router.get("/:userId", async (req: Request<{ userId: string }>, res: Response) => {
  const { userId } = req.params;
  try {
    const orders: IOrder[] = await Order.find({ userId });
    res.json(orders);
  } catch (err: any) {
    console.error("Error fetching orders for user:", err);
    res.status(500).send("Server error");
  }
});

// Get order by ID
router.get("/:userId/:orderId", async (req: Request<{ userId: string; orderId: string }>, res: Response) => {
  const { userId, orderId } = req.params;
  try {
    const order: IOrder | null = await Order.findOne({ userId, _id: orderId });
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json(order);
  } catch (err: any) {
    console.error("Error fetching order by ID:", err);
    res.status(500).send("Server error");
  }
});

// Update order status
router.put("/:orderId/status", async (req: Request<{ orderId: string }, any, UpdateStatusBody>, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order: IOrder | null = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err: any) {
    console.error("Error updating order status:", err);
    res.status(500).send("Server error");
  }
});

export default router;
