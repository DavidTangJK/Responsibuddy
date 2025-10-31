import express from "express";
import sqlite3 from "sqlite3";
import path from "path";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "data.db");
const db = new sqlite3.Database(DB_PATH);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      stars INTEGER DEFAULT 0,
      avatar TEXT DEFAULT 'default',
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      stars INTEGER DEFAULT 0,
      assignedTo TEXT DEFAULT 'all',
      assignedToName TEXT,
      completed INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      completedBy TEXT,
      completedAt TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      userId TEXT PRIMARY KEY,
      viewMode TEXT DEFAULT 'child',
      currentChildId TEXT
    )
  `);
});

// Helpers
const runAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    })
  );

const allAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

const getAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
  );

// API: Settings
app.get("/api/settings/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    let s = await getAsync("SELECT * FROM settings WHERE userId = ?", [userId]);
    if (!s) {
      await runAsync(
        "INSERT INTO settings (userId, viewMode, currentChildId) VALUES (?, 'child', NULL)",
        [userId]
      );
      s = await getAsync("SELECT * FROM settings WHERE userId = ?", [userId]);
    }
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/settings/:userId", async (req, res) => {
  const { userId } = req.params;
  const { viewMode, currentChildId } = req.body;
  try {
    await runAsync(
      "INSERT OR REPLACE INTO settings (userId, viewMode, currentChildId) VALUES (?, ?, ?)",
      [userId, viewMode || "child", currentChildId || null]
    );
    const s = await getAsync("SELECT * FROM settings WHERE userId = ?", [
      userId,
    ]);
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Children
app.get("/api/children", async (req, res) => {
  try {
    const rows = await allAsync(
      "SELECT * FROM children ORDER BY createdAt DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/children", async (req, res) => {
  const { name, avatar } = req.body;
  const id = uuidv4();
  try {
    await runAsync(
      "INSERT INTO children (id, name, stars, avatar) VALUES (?, ?, ?, ?)",
      [id, name, 0, avatar || "default"]
    );
    const child = await getAsync("SELECT * FROM children WHERE id = ?", [id]);
    res.status(201).json(child);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const rows = await allAsync("SELECT * FROM tasks ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { text, stars, assignedTo, assignedToName } = req.body;
  const id = uuidv4();
  try {
    await runAsync(
      "INSERT INTO tasks (id, text, stars, assignedTo, assignedToName, completed) VALUES (?, ?, ?, ?, ?, 0)",
      [id, text, stars || 0, assignedTo || "all", assignedToName || null]
    );
    const task = await getAsync("SELECT * FROM tasks WHERE id = ?", [id]);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { childId } = req.body;
  try {
    // mark task completed
    await runAsync(
      "UPDATE tasks SET completed = 1, completedBy = ?, completedAt = datetime('now') WHERE id = ?",
      [childId || null, id]
    );

    if (childId) {
      // increment child stars
      await runAsync(
        "UPDATE children SET stars = stars + (SELECT stars FROM tasks WHERE id = ?) WHERE id = ?",
        [id, childId]
      );
    }

    const updated = await getAsync("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`REST API server listening on http://localhost:${PORT}`)
);
