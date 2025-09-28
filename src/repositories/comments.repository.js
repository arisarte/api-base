import { pool } from '../config/db.js';

export const commentsRepository = {
  async create({ user_id, article_id, content }) {
    const [res] = await pool.query(
      'INSERT INTO comments (user_id, article_id, content) VALUES (?, ?, ?)',
      [user_id, article_id, content]
    );
    return { id: res.insertId, user_id, article_id, content };
  },

  async findByArticle(article_id) {
    const [rows] = await pool.query(
      `SELECT c.id, c.user_id, u.name AS user_name, c.article_id, c.content, c.created_at
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.article_id = ?
       ORDER BY c.created_at DESC`,
      [article_id]
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.query(
      `SELECT c.id, c.user_id, u.name AS user_name, c.article_id, c.content, c.created_at
       FROM comments c
       JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async remove(id) {
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    return true;
  }
};
