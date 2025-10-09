import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(">>", req.method, req.url);
  next();
});


app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Stock App backend running" });
});

//  quick pings
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/time", (_req, res) => res.send(new Date().toISOString()));

// catch-all → 404 JSON (so you never see “Cannot GET /” again)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: `No route: ${req.method} ${req.url}` });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
