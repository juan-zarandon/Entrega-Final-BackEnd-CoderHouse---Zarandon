import ProductModel from "../models/Product.js";

export async function obtenerProductos() {
  return await ProductModel.find().lean();
}

export async function crearProducto(productData) {
  const newProduct = await ProductModel.create(productData);
  return newProduct;
}

export async function eliminarProducto(productId) {
  const result = await ProductModel.findByIdAndDelete(productId);
  return result;
}

export async function obtenerProductoPorId(productId) {
  const product = await ProductModel.findById(productId).lean();
  return product;
}

export async function actualizarProducto(productId, updates) {
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    updates,
    { new: true, runValidators: true }
  ).lean();
  return updatedProduct;
}
