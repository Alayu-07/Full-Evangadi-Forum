import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// ===============================
// TiDB / MySQL Database Connection
// ===============================

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // TiDB Cloud requires a secure TLS connection
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ===============================
// Validate SQL Parameters
// ===============================

const ensureParams = (params) => {
  if (params === undefined || params === null) {
    throw new Error("SQL parameters are required");
  }

  const isArray = Array.isArray(params);
  const isObject = !isArray && typeof params === "object";

  if (!isArray && !isObject) {
    throw new Error("SQL parameters must be an array or object");
  }
};

// ===============================
// Safe SQL Execute Function
// ===============================

export const safeExecute = async (sql, params) => {
  if (typeof sql !== "string" || sql.trim().length === 0) {
    throw new Error("SQL query must be a non-empty string");
  }

  ensureParams(params);

  const [result] = await db.execute(sql, params);

  return result;
};
