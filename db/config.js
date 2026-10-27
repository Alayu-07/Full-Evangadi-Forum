import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

// Database connection pool with mandatory TiDB SSL configuration
export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "evangadi_forum",
  port: process.env.DB_PORT || 4000, // TiDB Cloud default port is 4000

  // FIX: Added secure TLS/SSL configuration required by TiDB Cloud
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },

  waitForConnections: true,
  connectionLimit: 10,
});

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

export const safeExecute = async (sql, params) => {
  if (typeof sql !== "string" || sql.trim().length === 0) {
    throw new Error("SQL query must be a non-empty string");
  }
  ensureParams(params);
  const [result] = await db.execute(sql, params);
  return result;
};
