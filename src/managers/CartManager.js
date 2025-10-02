import Cart from "../models/Cart.js";

class CartManager {
  async getCarts() {
    try {
      return await Cart.find().populate("products.product");
    } catch (error) {
      console.error("Error getting carts:", error);
      return [];
    }
  }

  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      return await Cart.findById(id).populate("products.product");
    } catch (error) {
      console.error("Error getting cart by id:", error);
      return null;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) return { error: "carrito no encontrado" };

      const existingProduct = cart.products.find(
        (p) => p.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
      return await Cart.findById(cartId).populate("products.product");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error;
    }
  }
}

export default CartManager;
