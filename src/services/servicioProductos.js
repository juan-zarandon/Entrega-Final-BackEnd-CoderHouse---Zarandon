import ProductManager from "../managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productManager = new ProductManager(
  path.join(__dirname, "..", "data", "products.json")
);

export const obtenerProductos = async () => {
  return await productManager.getProducts();
};

export const crearProducto = async (productData) => {
  return await productManager.addProduct(productData);
};

export const eliminarProducto = async (productId) => {
  return await productManager.deleteProduct(productId);
};
