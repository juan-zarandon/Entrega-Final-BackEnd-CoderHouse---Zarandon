import { Router } from "express";
import Cart from "../models/Cart.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({});
    res.status(201).json(newCart);
  } catch (error) {
    console.error("❌ Error en POST /api/carts:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await Cart.findById(cartId)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).json({ error: "El carrito no se encuentra" });
    }

    res.json(cart);
  } catch (error) {
    console.error("❌ Error en GET /api/carts/:cid:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity: quantity });
    }

    const result = await cart.save();

    res.json(result);
  } catch (error) {
    console.error("❌ Error en POST /api/carts/:cid/product/:pid:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    ).lean();

    if (!result) {
      return res
        .status(404)
        .json({ error: "Carrito o Producto no encontrado" });
    }

    res.json({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const result = await Cart.findByIdAndUpdate(
      cartId,
      { $set: { products: [] } },
      { new: true }
    ).lean();

    if (!result) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productsArray = req.body;

    const result = await Cart.findByIdAndUpdate(
      cartId,
      { $set: { products: productsArray } },
      { new: true, runValidators: true }
    ).lean();

    if (!result) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad debe ser un número positivo." });
    }

    const result = await Cart.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    ).lean();

    if (!result) {
      return res
        .status(404)
        .json({ error: "Carrito o Producto no encontrado en el carrito." });
    }

    res.json({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
