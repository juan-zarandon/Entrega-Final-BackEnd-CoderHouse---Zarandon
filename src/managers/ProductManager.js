import Product from "../models/Product.js";

class ProductManager {
  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async addProduct(productData) {
    try {
      const { title, description, code, price, stock, category } = productData;

      if (
        !title ||
        !description ||
        !code ||
        !price ||
        stock === undefined ||
        !category
      ) {
        throw new Error("Faltan campos obligatorios");
      }

      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        throw new Error(`El producto con código "${code}" ya existe`);
      }

      const newProduct = new Product({
        title,
        description,
        code,
        price: Number(price),
        stock: Number(stock),
        category,
        thumbnails: productData.thumbnails || [],
        status: productData.status !== undefined ? productData.status : true,
      });

      await newProduct.save();
      console.log("✅ Producto guardado en MongoDB:", newProduct._id);

      return newProduct;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El código del producto ya existe");
      }
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }

      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        throw new Error("Producto no encontrado");
      }

      return {
        message: "Producto eliminado correctamente",
        product: deletedProduct,
      };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  async getProductsPaginated(options = {}) {
    try {
      const { limit = 10, page = 1, sort, query } = options;

      const filter = {};
      if (query) {
        if (query.includes("category:")) {
          filter.category = query.split(":")[1];
        } else {
          filter.title = { $regex: query, $options: "i" };
        }
      }

      const sortOptions = {};
      if (sort === "asc") {
        sortOptions.price = 1;
      } else if (sort === "desc") {
        sortOptions.price = -1;
      }

      const products = await Product.find(filter)
        .sort(sortOptions)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        status: "success",
        payload: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        nextLink:
          page < totalPages
            ? `/api/products?page=${page + 1}&limit=${limit}`
            : null,
      };
    } catch (error) {
      throw new Error(`Error en consulta paginada: ${error.message}`);
    }
  }
}

export default ProductManager;
