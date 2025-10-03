import { Router } from "express";

import { obtenerProductos } from "../services/servicioProductos.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await obtenerProductos();

    res.render("home", { products: products });
  } catch (error) {
    console.error("❌ Error en GET / (Vistas):", error);
    res.status(500).render("error", { message: "Error al cargar productos." });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await obtenerProductos();

    res.render("realTimeProducts", { products: products });
  } catch (error) {
    console.error("❌ Error en GET /realtimeproducts:", error);
    res
      .status(500)
      .render("error", { message: "Error al cargar la vista en tiempo real." });
  }
});

export default router;
