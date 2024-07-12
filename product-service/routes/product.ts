import express, { Router, Request, Response } from "express";
import Product, { IProduct } from "../models/product";

const router: Router = express.Router();

// Interface for request body when creating/updating a product
interface ProductRequestBody {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

interface DeductStockBody {
  quantity: number;
}

// Create Product
router.post("/create", async (req: Request<{}, any, ProductRequestBody>, res: Response) => {
  const { name, description, price, category, stock } = req.body;
  try {
    const newProduct: IProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err: any) {
    console.error("Error creating product:", err);
    res.status(500).send("Server error");
  }
});

// Get All Products
router.get("/", async (req: Request, res: Response) => {
  try {
    // TODO: Implement pagination for fetching all products
    const products: IProduct[] = await Product.find();
    res.json(products);
  } catch (err: any) {
    console.error("Error fetching all products:", err);
    res.status(500).send("Server error");
  }
});

// Advanced Search & Filtering for Products
router.get("/search", async (req: Request, res: Response) => {
  try {
    // Placeholder for search logic based on query parameters (e.g., name, category, priceRange)
    // const { q, category, minPrice, maxPrice } = req.query;
    // Implement search and filtering logic here
    const products: IProduct[] = await Product.find({ name: /sample/i }); // Example: find products with 'sample' in name
    if (products.length === 0) {
      return res.status(404).json({ msg: "No products found matching your criteria" });
    }
    res.json(products);
  } catch (err: any) {
    console.error("Error during product search:", err);
    res.status(500).send("Server error");
  }
});

// Get Product by ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const product: IProduct | null = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err: any) {
    console.error("Error fetching product by ID:", err);
    res.status(500).send("Server error");
  }
});

// Update Product
router.put("/:id", async (req: Request<{ id: string }, any, Partial<ProductRequestBody>>, res: Response) => {
  try {
    const updatedProduct: IProduct | null = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ msg: "Product not found" });
    res.json(updatedProduct);
  } catch (err: any) {
    console.error("Error updating product:", err);
    res.status(500).send("Server error");
  }
});

// Delete Product
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const product: IProduct | null = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product deleted" });
  } catch (err: any) {
    console.error("Error deleting product:", err);
    res.status(500).send("Server error");
  }
});

// Deduct stock (as used by order-service)
router.put("/:id/deduct", async (req: Request<{ id: string }, any, DeductStockBody>, res: Response) => {
  const { quantity } = req.body;
  try {
    const product: IProduct | null = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ msg: "Not enough stock" });
    }
    product.stock -= quantity;
    await product.save();
    res.json(product);
  } catch (err: any) {
    console.error("Error deducting stock:", err);
    res.status(500).send("Server error");
  }
});

export default router;
