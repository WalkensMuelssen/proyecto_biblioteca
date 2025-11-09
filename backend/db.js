import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let poolPromise;

export const getConnection = async () => {
  if (!poolPromise) {
    try {
      poolPromise = await sql.connect(dbConfig);
      console.log("✅ Conectado a SQL Server correctamente");
    } catch (err) {
      console.error("❌ Error al conectar con SQL Server:", err);
      poolPromise = null;
    }
  }
  return poolPromise;
};

export { sql };
