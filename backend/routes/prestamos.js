import express from "express";
import { getConnection, sql } from "../db.js";
const router = express.Router();

// Listar préstamos (con info del usuario y libro)
router.get("/", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT P.id, P.usuario_id, P.libro_id, P.fecha_prestamo, P.fecha_devolucion, P.estado,
             U.nombre as Usuario, L.titulo as Libro
      FROM Prestamos P
      LEFT JOIN Usuarios U ON P.usuario_id = U.id
      LEFT JOIN Libros L ON P.libro_id = L.id
      ORDER BY P.fecha_prestamo DESC
    `);
    res.json(result.recordset);
  } catch (err) { res.status(500).json({error:'Error'}); }
});

// Crear préstamo
router.post("/", async (req, res) => {
  const { usuario_id, libro_id } = req.body;
  try {
    const pool = await getConnection();
    await pool.request()
      .input("usuario_id", sql.Int, usuario_id)
      .input("libro_id", sql.Int, libro_id)
      .query("INSERT INTO Prestamos (usuario_id, libro_id, fecha_prestamo, estado) VALUES (@usuario_id, @libro_id, GETDATE(), 'Activo')");
    res.json({ message: 'Prestamo creado' });
  } catch (err) { res.status(500).json({error:'Error'}); }
});

// Devolver (PUT) — cambia estado y fecha_devolucion
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const pool = await getConnection();
    await pool.request()
      .input("id", sql.Int, id)
      .query("UPDATE Prestamos SET estado='Devuelto', fecha_devolucion = GETDATE() WHERE id = @id");
    res.json({ message: 'Devuelto' });
  } catch (err) { res.status(500).json({error:'Error'}); }
});

export default router;
