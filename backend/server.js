import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getConnection } from "./db.js";
import librosRoutes from "./routes/libros.js";
import usuariosRoutes from "./routes/usuarios.js";
import prestamosRoutes from "./routes/prestamos.js";
import reservasRoutes from "./routes/reservas.js";
import loginRoutes from "./routes/login.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/libros", librosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/prestamos", prestamosRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/login", loginRoutes);

const PORT = process.env.PORT || 5000;


getConnection()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error al iniciar el servidor:", err);
  });
