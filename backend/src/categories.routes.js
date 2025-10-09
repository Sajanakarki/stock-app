import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

router.get("/", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM stock_categories ORDER BY id DESC");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { name, description } = req.body;
  const [r] = await pool.query(
    "INSERT INTO stock_categories (name, description) VALUES (?,?)",
    [name, description ?? null]
  );
  const [rows] = await pool.query("SELECT * FROM stock_categories WHERE id=?", [r.insertId]);
  res.status(201).json(rows[0]);
});

export default router;