/**
 * Seed script – populates the database with demo users.
 * Run: node seed.js
 */
const { v4: uuidv4 } = require('uuid');
const { getDB, run, all } = require('./database'); 

const USERS = [
  { name: 'Alice Johnson',  email: 'alice@example.com',  role: 'admin',     phone: '+1-555-0101' },
  { name: 'Bob Smith',      email: 'bob@example.com',    role: 'user',      phone: '+1-555-0102' },
  { name: 'Carol Williams', email: 'carol@example.com',  role: 'moderator', phone: '+1-555-0103' },
  { name: 'David Brown',    email: 'david@example.com',  role: 'user',      phone: '+1-555-0104' },
  { name: 'Eve Davis',      email: 'eve@example.com',    role: 'user',      phone: '+1-555-0105' },
];

(async () => {
  await getDB();
  const existing = all('SELECT email FROM users');
  const existingEmails = new Set(existing.map(u => u.email));

  let seeded = 0;
  for (const u of USERS) {
    if (existingEmails.has(u.email)) {
      console.log(`⚠  Skipping ${u.email} (already exists)`);
      continue;
    }
    const now = new Date().toISOString();
    run(
      `INSERT INTO users (id, name, email, role, phone, avatar, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), u.name, u.email, u.role, u.phone, null, now, now]
    );
    console.log(`✓  Seeded: ${u.name} <${u.email}>`);
    seeded++;
  }

  console.log(`\nDone. ${seeded} user(s) added.`);
  process.exit(0);
})();
