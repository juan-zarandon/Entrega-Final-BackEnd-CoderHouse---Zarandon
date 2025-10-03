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

const PORT = 8081;

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const servidorHttp = http.createServer(app);
const io = new Server(servidorHttp);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
});

servidorHttp.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
