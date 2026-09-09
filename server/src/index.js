import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const app = express();

// ---------- Middleware ----------
// cors(): lets the frontend (a different port) call this API
app.use(cors());

// express.json(): reads JSON sent in request bodies (needed for POST/PUT)
app.use(express.json());

// ---------- Routes ----------

// Health check — a simple route to confirm the server is alive
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Support CRM API is running",
  });
});

// 404 handler — catches any route we haven't defined
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Start the server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});