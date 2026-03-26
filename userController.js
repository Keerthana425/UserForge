const { v4: uuidv4 } = require('uuid');
const db = require('./database'); 

// ─── GET /users ──────────────────────────────────────────────────────────────
async function listUsers(req, res) {
  try {
    const { search = '', sort = 'createdAt', order = 'asc' } = req.query;

    // Whitelist sortable columns
    const SORTABLE = ['name', 'email', 'role', 'createdAt', 'updatedAt'];
    const sortCol = SORTABLE.includes(sort) ? sort : 'createdAt';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let sql;
    let params;

    if (search) {
      const pattern = `%${search}%`;
      sql = `
        SELECT * FROM users
        WHERE name LIKE ? OR email LIKE ? OR role LIKE ?
        ORDER BY ${sortCol} ${sortOrder}
      `;
      params = [pattern, pattern, pattern];
    } else {
      sql = `SELECT * FROM users ORDER BY ${sortCol} ${sortOrder}`;
      params = [];
    }

    const users = db.all(sql, params);

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error('[listUsers]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// ─── GET /users/:id ───────────────────────────────────────────────────────────
async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = db.get('SELECT * FROM users WHERE id = ?', [id]);

    if (!user) {
      return res.status(404).json({ success: false, message: `User with id '${id}' not found` });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('[getUser]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// ─── POST /users ─────────────────────────────────────────────────────────────
async function createUser(req, res) {
  try {
    const { name, email, role = 'user', phone = null, avatar = null } = req.body;

    // Check email uniqueness
    const existing = db.get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists' });
    }

    const now = new Date().toISOString();
    const user = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      phone: phone || null,
      avatar: avatar || null,
      createdAt: now,
      updatedAt: now,
    };

    db.run(
      `INSERT INTO users (id, name, email, role, phone, avatar, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.role, user.phone, user.avatar, user.createdAt, user.updatedAt]
    );

    return res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) {
    console.error('[createUser]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// ─── PUT /users/:id ───────────────────────────────────────────────────────────
async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const existing = db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: `User with id '${id}' not found` });
    }

    const { name, email, role, phone, avatar } = req.body;

    // If email is being changed, check for conflicts
    if (email && email.trim().toLowerCase() !== existing.email) {
      const conflict = db.get('SELECT id FROM users WHERE email = ? AND id != ?', [
        email.trim().toLowerCase(),
        id,
      ]);
      if (conflict) {
        return res.status(409).json({ success: false, message: 'Another user with this email already exists' });
      }
    }

    const updated = {
      name: name !== undefined ? name.trim() : existing.name,
      email: email !== undefined ? email.trim().toLowerCase() : existing.email,
      role: role !== undefined ? role : existing.role,
      phone: phone !== undefined ? phone : existing.phone,
      avatar: avatar !== undefined ? avatar : existing.avatar,
      updatedAt: new Date().toISOString(),
    };

    db.run(
      `UPDATE users
       SET name=?, email=?, role=?, phone=?, avatar=?, updatedAt=?
       WHERE id=?`,
      [updated.name, updated.email, updated.role, updated.phone, updated.avatar, updated.updatedAt, id]
    );

    const user = db.get('SELECT * FROM users WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    console.error('[updateUser]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// ─── DELETE /users/:id ────────────────────────────────────────────────────────
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const existing = db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: `User with id '${id}' not found` });
    }

    db.run('DELETE FROM users WHERE id = ?', [id]);

    return res.status(200).json({ success: true, message: 'User deleted successfully', data: existing });
  } catch (err) {
    console.error('[deleteUser]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
