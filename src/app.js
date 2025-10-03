import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

const httpServer = createServer(app);
const io = new Server(httpServer);

mongoose
  .connect("mongodb://localhost:27017/coderhouse-backend")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter(io));

// --- RUTA PRINCIPAL (RAÍZ) ---
app.get("/", (req, res) => {
  // ⚠️ IMPORTANTE: Asegúrate de que 'home' coincida con el nombre de tu archivo Handlebars (ej: 'home.handlebars')
  res.render("home", {
    // Los datos que pases aquí (como 'titulo') estarán disponibles en tu plantilla Handlebars
    titulo: "Mi Tienda",
    mensaje: "Bienvenido a mi aplicación web con Handlebars",
  });
});

io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 WebSocket disponible`);
});

export default app;
