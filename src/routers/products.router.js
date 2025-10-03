import { Router } from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from "../services/servicioProductos.js";

export default (io) => {
  const router = Router();

  router.post("/", async (req, res) => {
    try {
      console.log("📦 POST /api/products - Body:", req.body);

      const newProduct = await crearProducto(req.body);

      const allProducts = await obtenerProductos();
      io.emit("productos:lista", allProducts);

      console.log("✅ Producto creado:", newProduct._id);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("❌ Error en POST /api/products:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
