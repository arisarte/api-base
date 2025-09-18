import { pool } from '../config/db.js';

export const articlesRepository = {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT 
        a.id, a.title, a.slug, a.content, a.cover_image,
        a.meta_title, a.meta_description, a.keywords,
        a.category_id, c.name AS category_name,
        a.author, a.created_at, a.updated_at
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      ORDER BY a.id DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT 
        a.id, a.title, a.slug, a.content, a.cover_image,
        a.meta_title, a.meta_description, a.keywords,
        a.category_id, c.name AS category_name,
        a.author, a.created_at, a.updated_at
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async create(data) {
    const {
      title, slug, content, cover_image,
      meta_title, meta_description, keywords,
      category_id, author
    } = data;

    const [result] = await pool.query(`
      INSERT INTO articles 
        (title, slug, content, cover_image, meta_title, meta_description, keywords, category_id, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, slug, content, cover_image, meta_title, meta_description, keywords, category_id, author]);

    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const {
      title, slug, content, cover_image,
      meta_title, meta_description, keywords,
      category_id, author
    } = data;

    await pool.query(`
      UPDATE articles
      SET title=?, slug=?, content=?, cover_image=?, meta_title=?, meta_description=?, keywords=?, category_id=?, author=?
      WHERE id=?
    `, [title, slug, content, cover_image, meta_title, meta_description, keywords, category_id, author, id]);

    return { id, ...data };
  },

  async remove(id) {
    await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    return true;
  }
};
