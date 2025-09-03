import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";

import {
  obtenerProductos,
  crearProducto,
  eliminarProducto,
} from "./services/servicioProductos.js";

const PORT = process.env.PORT || 8080;

const servidorHttp = http.createServer(app);
const io = new Server(servidorHttp);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  socket.emit("productos:lista", await obtenerProductos());

  socket.on("producto:crear", async (datos) => {
    const productData = {
      ...datos,
      description: datos.description || "Sin descripción",
      code: datos.code || `CODE_${Date.now()}`,
      stock: datos.stock || 10,
      category: datos.category || "General",
    };
    const nuevoProducto = await crearProducto(productData);
    io.emit("productos:lista", await obtenerProductos());
  });

  socket.on("producto:eliminar", async (idProducto) => {
    await eliminarProducto(idProducto);
    io.emit("productos:lista", await obtenerProductos());
  });
});

servidorHttp.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
