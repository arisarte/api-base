import { pool } from '../config/db.js';

export const usersRepository = {
  async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async create({ name, email, password, role = 'user' }) {
    const [res] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]);
    return { id: res.insertId, name, email, role };
  },

  async update(id, { name, password }) {
    await pool.query('UPDATE users SET name = ?, password = ? WHERE id = ?', [name, password, id]);
    return this.findById(id);
  },

  async findAll() {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
    return rows;
  }
};
