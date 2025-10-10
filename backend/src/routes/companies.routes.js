import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// List (ordered by id ASC)
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, description, created_at, updated_at
      FROM stock_categories
      ORDER BY id ASC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Create
router.post("/", async (req, res) => {
  const { name, description } = req.body ?? {};
  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, error: "Name is required" });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO stock_categories (name, description) VALUES (?, ?)`,
      [name.trim(), description ?? ""]
    );
    const [rows] = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM stock_categories WHERE id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body ?? {};
  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, error: "Name is required" });
  }
  try {
    await pool.query(
      `UPDATE stock_categories
       SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name.trim(), description ?? "", id]
    );
    const [rows] = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM stock_categories WHERE id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM stock_categories WHERE id = ?`, [id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
