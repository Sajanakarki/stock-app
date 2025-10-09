import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool, assertDbReady } from "./db.js";
import categories from "./routes/categories.routes.js";
import companies from "./routes/companies.routes.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/categories", categories);
app.use("/api/companies", companies);

// health
app.get("/", async (_req, res) => {
  try {
    await assertDbReady();
    await pool.query("SELECT 1");
    res.json({ ok: true, message: "Stock App backend running" });
  } catch {
    res.status(500).json({ ok: false });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
