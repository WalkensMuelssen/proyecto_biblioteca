import express from "express";
import { getConnection, sql } from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`SELECT R.id, R.usuario_id, R.libro_id, R.fecha_reserva, R.estado,
                     U.nombre as Usuario, L.titulo as Libro
              FROM Reservas R
              LEFT JOIN Usuarios U ON R.usuario_id = U.id
              LEFT JOIN Libros L ON R.libro_id = L.id
              ORDER BY R.fecha_reserva DESC`);
    res.json(result.recordset);
  } catch (err) { res.status(500).json({error:'Error'}); }
});

router.post("/", async (req, res) => {
  const { usuario_id, libro_id } = req.body;
  try {
    const pool = await getConnection();
    await pool.request()
      .input("usuario_id", sql.Int, usuario_id)
      .input("libro_id", sql.Int, libro_id)
      .query("INSERT INTO Reservas (usuario_id, libro_id, fecha_reserva, estado) VALUES (@usuario_id, @libro_id, GETDATE(), 'Pendiente')");
    res.json({ message: 'Reserva creada' });
  } catch (err) { res.status(500).json({error:'Error'}); }
});

export default router;
