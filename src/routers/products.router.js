import { Router } from "express";
import {
  obtenerProductosPaginados,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/servicioProductos.js";

const router = Router();

const buildLink = (url, page, limit, sort, query) => {
  if (!page) return null;
  let link = `${url}?page=${page}&limit=${limit}`;
  if (sort) link += `&sort=${sort}`;
  if (query) link += `&query=${query}`;
  return link;
};

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const paginatedResult = await obtenerProductosPaginados(
      parseInt(limit),
      parseInt(page),
      sort,
      query
    );

    const {
      docs: payload,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
    } = paginatedResult;

    const currentUrl =
      req.protocol + "://" + req.get("host") + req.originalUrl.split("?")[0];

    const prevLink = hasPrevPage
      ? buildLink(currentUrl, prevPage, limit, sort, query)
      : null;

    const nextLink = hasNextPage
      ? buildLink(currentUrl, nextPage, limit, sort, query)
      : null;

    res.json({
      status: "success",
      payload: payload,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: currentPage,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
  } catch (error) {
    console.error("❌ Error en GET /api/products (Paginación):", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await obtenerProductoPorId(req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await crearProducto(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await actualizarProducto(req.params.pid, req.body);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: "Producto no encontrado para actualizar" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await eliminarProducto(req.params.pid);
    if (deletedProduct) {
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado para eliminar" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
