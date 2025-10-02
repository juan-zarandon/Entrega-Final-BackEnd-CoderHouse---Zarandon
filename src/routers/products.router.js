import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

export default (io) => {
  const router = Router();
  const productManager = new ProductManager();

  router.post("/", async (req, res) => {
    try {
      const product = req.body;
      const newProduct = await productManager.addProduct(product);

      io.emit("productos:lista", await productManager.getProducts());

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:pid", async (req, res) => {
    try {
      const result = await productManager.deleteProduct(req.params.pid);

      io.emit("productos:lista", await productManager.getProducts());

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
