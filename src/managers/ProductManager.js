import Product from "../models/Product.js";

class ProductManager {
  async getProducts() {
    try {
      return await Product.find();
    } catch (error) {
      console.error("Error getting products:", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error("Error getting product by id:", error);
      return null;
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = new Product({
        title: productData.title || productData.nombre,
        description: productData.description,
        code: productData.code,
        price: productData.price || productData.precio,
        status: productData.status ?? true,
        stock: productData.stock,
        category: productData.category,
        thumbnails: productData.thumbnails || [],
      });

      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  async updateProduct(id, updates) {
    try {
      delete updates.id;
      const updated = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updated) return { error: "No encontrado" };
      return updated;
    } catch (error) {
      console.error("Error updating product:", error);
      return { error: "Error al actualizar" };
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
      return { message: `Producto ${id} eliminado` };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

export default ProductManager;
