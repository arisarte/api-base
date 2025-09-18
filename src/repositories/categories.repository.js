import { pool } from '../config/db.js';

export const categoriesRepository = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY id DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const { name, slug, description } = data;
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description]
    );
    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const { name, slug, description } = data;
    await pool.query(
      'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
      [name, slug, description, id]
    );
    return { id, ...data };
  },

  async remove(id) {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return true;
  }
};
