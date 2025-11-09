import express from "express";
import { getConnection, sql } from "../db.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Usuarios");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

export default router;
