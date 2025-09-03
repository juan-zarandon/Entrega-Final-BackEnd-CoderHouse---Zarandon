import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productManager = new ProductManager(
  path.join(__dirname, "../data/products.json")
);

const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products: products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products: products });
});

export default router;
