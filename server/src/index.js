import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./db.js";
import router from "./routes/tickets.js";

// Load environment variables from the .env file
dotenv.config();

const app = express();

// ---------- Middleware ----------
// cors(): lets the frontend (a different port) call this API
app.use(cors());

// express.json(): reads JSON sent in request bodies (needed for POST/PUT)
app.use(express.json());

// ---------- Routes ----------

// Health check — verifies server + database connection
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
      message: "Support CRM API is running",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

// All ticket routes live in routes/tickets.js
app.use("/api/tickets", router);

// 404 handler — must stay AFTER all other routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Start the server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});