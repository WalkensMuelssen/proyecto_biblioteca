import express from "express";
import { getConnection, sql } from "../db.js";

const router = express.Router();

// Obtener todos los libros
router.get("/", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Libros");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener libros:", err);
    res.status(500).json({ error: "Error al obtener los libros" });
  }
});

export default router;
