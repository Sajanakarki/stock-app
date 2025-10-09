import { Router } from "express";
import { pool } from "../db.js";
import { categorySchema } from "../validators.js";

const router = Router();

// List
router.get("/", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM stock_categories ORDER BY id DESC"
  );
  res.json(rows);
});

// Get one
router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM stock_categories WHERE id=?",
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Category not found" });
  res.json(rows[0]);
});

// Create
router.post("/", async (req, res) => {
  try {
    const data = await categorySchema.validate(req.body, { abortEarly: false });
    const [r] = await pool.query(
      "INSERT INTO stock_categories (name, description) VALUES (?, ?)",
      [data.name, data.description ?? null]
    );
    const [rows] = await pool.query("SELECT * FROM stock_categories WHERE id=?", [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Category name already exists" });
    if (err?.name === "ValidationError") return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Server error" });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const data = await categorySchema.validate(req.body, { abortEarly: false });
    const [r] = await pool.query(
      "UPDATE stock_categories SET name=?, description=? WHERE id=?",
      [data.name, data.description ?? null, req.params.id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: "Category not found" });
    const [rows] = await pool.query("SELECT * FROM stock_categories WHERE id=?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Category name already exists" });
    if (err?.name === "ValidationError") return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Server error" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const [r] = await pool.query("DELETE FROM stock_categories WHERE id=?", [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ ok: true });
  } catch (err) {
    if (err?.code === "ER_ROW_IS_REFERENCED_2") return res.status(409).json({ error: "Category in use by companies" });
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
