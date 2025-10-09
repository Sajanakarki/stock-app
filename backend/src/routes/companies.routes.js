import { Router } from "express";
import { pool } from "../db.js";
import { companySchema } from "../validators.js";

const router = Router();

// List (with category name)
router.get("/", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT c.*, cat.name AS category_name
    FROM stock_companies c
    JOIN stock_categories cat ON cat.id = c.category_id
    ORDER BY c.id DESC
  `);
  res.json(rows);
});

// Get one
router.get("/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM stock_companies WHERE id=?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "Company not found" });
  res.json(rows[0]);
});

// Create
router.post("/", async (req, res) => {
  try {
    const data = await companySchema.validate(req.body, { abortEarly: false });

    const [cat] = await pool.query("SELECT id FROM stock_categories WHERE id=?", [data.category_id]);
    if (cat.length === 0) return res.status(400).json({ error: "Invalid category_id" });

    const [r] = await pool.query(
      "INSERT INTO stock_companies (name, category_id, ticker_symbol, description) VALUES (?, ?, ?, ?)",
      [data.name, data.category_id, data.ticker_symbol, data.description ?? null]
    );
    const [rows] = await pool.query("SELECT * FROM stock_companies WHERE id=?", [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Ticker symbol already exists" });
    if (err?.name === "ValidationError") return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Server error" });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const data = await companySchema.validate(req.body, { abortEarly: false });
    const [r] = await pool.query(
      "UPDATE stock_companies SET name=?, category_id=?, ticker_symbol=?, description=? WHERE id=?",
      [data.name, data.category_id, data.ticker_symbol, data.description ?? null, req.params.id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: "Company not found" });
    const [rows] = await pool.query("SELECT * FROM stock_companies WHERE id=?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Ticker symbol already exists" });
    if (err?.name === "ValidationError") return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Server error" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const [r] = await pool.query("DELETE FROM stock_companies WHERE id=?", [req.params.id]);
  if (r.affectedRows === 0) return res.status(404).json({ error: "Company not found" });
  res.json({ ok: true });
});

export default router;
