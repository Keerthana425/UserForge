const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'users.db');

let db = null;

async function getDB() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Ensure data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Load from disk if exists, else create new
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id        TEXT PRIMARY KEY,
      name      TEXT NOT NULL,
      email     TEXT NOT NULL UNIQUE,
      role      TEXT NOT NULL DEFAULT 'user',
      phone     TEXT,
      avatar    TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  persist();
  return db;
}

function persist() {
  if (!db) return;
  const data = db.export();
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Helper: run a write query and persist
function run(sql, params = []) {
  db.run(sql, params);
  persist();
}

// Helper: return all rows as array of objects
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

// Helper: return single row
function get(sql, params = []) {
  const results = all(sql, params);
  return results[0] || null;
}

module.exports = { getDB, run, get, all, persist };
