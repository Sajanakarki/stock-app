import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,                
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const pool = mysql.createPool(config);

export async function assertDbReady(retries = 5, delayMs = 400) {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      return true;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}
