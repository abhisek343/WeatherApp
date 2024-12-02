import express, { Router, Request, Response } from "express";
import Cart, { ICart, ICartItem } from "../models/cart";
import axios, { AxiosResponse } from "axios";

const router: Router = express.Router();

const PRODUCT_SERVICE_URI: string =
  process.env.PRODUCT_SERVICE_URI || "http://localhost:5001";

// Define a basic structure for product data from product-service
interface ProductData {
  _id: string;
  name: string;
  // Add other relevant fields if needed for validation or display
}

interface AddToCartBody {
  productId: string;
  quantity: number;
}

interface UpdateQuantityBody {
  quantity: number;
}

// Add Item to Cart
// This route handles adding a new product or updating the quantity of an existing product in the cart.
// UNIQUE_CHANGE_FOR_COMMIT_39
router.post("/:userId/add", async (req: Request<{ userId: string }, any, AddToCartBody>, res: Response) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ msg: "Quantity must be positive" });
  }

  try {
    // Validate product existence
    try {
      const productResponse: AxiosResponse<ProductData> = await axios.get(
        `${PRODUCT_SERVICE_URI}/api/products/${productId}`
      );
      if (!productResponse.data) {
        return res.status(404).json({ msg: "Product not found in product service" });
      }
    } catch (productError: any) {
      console.error("Error fetching product:", productError.message);
      return res.status(productError.response?.status || 500).json({ msg: "Error validating product with product service" });
    }
    

    let cart: ICart | null = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart with the item
      // Ensure items are correctly typed as ICartItem[] or compatible
      const newCartItem = { productId, quantity } as ICartItem; // Cast if necessary, or ensure constructor handles it
      cart = new Cart({ userId, items: [newCartItem] });
    } else {
      // Cart exists, find item and update quantity or add new item
      const itemIndex = cart.items.findIndex(
        (item: ICartItem) => item.productId.toString() === productId // Ensure comparison is correct (e.g. if productId is ObjectId)
      );

      if (itemIndex > -1) {
        // Item exists in cart, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Item does not exist in cart, add new item
        cart.items.push({ productId, quantity } as ICartItem); // Cast if necessary
      }
    }

    await cart.save();
    res.status(200).json(cart); // Changed to 200 for update/add, 201 is typically for new resource creation
  } catch (err: any) {
    console.error("Error adding item to cart:", err);
    res.status(500).send("Server error");
  }
});

// Get User Cart
router.get("/:userId", async (req: Request<{ userId: string }>, res: Response) => {
  const { userId } = req.params;
  try {
    const cart: ICart | null = await Cart.findOne({ userId });
    // Optionally populate product details here if needed by frontend
    if (!cart) return res.status(404).json({ msg: "Cart not found" });
    res.json(cart);
  } catch (err: any) {
    console.error("Error fetching user cart:", err);
    res.status(500).send("Server error");
  }
});

// Remove Item from Cart
router.delete("/:userId/remove/:productId", async (req: Request<{ userId: string; productId: string }>, res: Response) => {
  const { userId, productId } = req.params;
  try {
    let cart: ICart | null = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item: ICartItem) => item.productId.toString() !== productId
    );

    if (cart.items.length === initialLength) {
        return res.status(404).json({ msg: "Product not found in cart" });
    }

    await cart.save();
    res.json(cart);
  } catch (err: any) {
    console.error("Error removing item from cart:", err);
    res.status(500).send("Server error");
  }
});

// Update Item Quantity
router.put("/:userId/update/:productId", async (req: Request<{ userId: string; productId: string }, any, UpdateQuantityBody>, res: Response) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    // If quantity is zero or less, consider removing the item instead
    // Or return an error, depending on desired behavior
    return res.status(400).json({ msg: "Quantity must be positive. To remove an item, use the remove endpoint." });
  }

  try {
    let cart: ICart | null = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item: ICartItem) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ msg: "Product not found in cart" });
    }

    await cart.save();
    res.json(cart);
  } catch (err: any) {
    console.error("Error updating item quantity:", err);
    res.status(500).send("Server error");
  }
});

export default router;
