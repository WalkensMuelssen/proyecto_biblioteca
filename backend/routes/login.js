import express from "express";
import { getConnection, sql } from "../db.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) return res.status(400).json({ message: "Faltan credenciales" });

  try {
    const pool = await getConnection();
    // buscamos por correo o por nombre el usario en db
    const result = await pool.request()
      .input("user", sql.VarChar, user)
      .input("password", sql.VarChar, password)
      .query(`SELECT id, nombre, correo, rol_id FROM Usuarios WHERE (correo = @user OR nombre = @user) AND contraseña = @password`);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const u = result.recordset[0];
    // opcional: mapear rol desde Roles si lo deseas
    res.json({ id: u.id, nombre: u.nombre, correo: u.correo, rol_id: u.rol_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en servidor" });
  }
});

export default router;
