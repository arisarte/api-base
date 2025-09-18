import { pool } from '../config/db.js';

export async function findAllItems() {
  const [rows] = await pool.query(
    'SELECT * FROM items ORDER BY created_at ASC'
  );
  return rows;
}

export async function findItemById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM items WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

export async function createItem(data) {
  const { name, slug } = data;
  const [result] = await pool.query(
    'INSERT INTO items (name, slug, created_at) VALUES (?, ?, NOW())',
    [name, slug]
  );
  return { id: result.insertId, name, slug };
}

export async function updateItem(id, data) {
  const { name, slug } = data;
  await pool.query(
    'UPDATE items SET name = ?, slug = ?, updated_at = NOW() WHERE id = ?',
    [name, slug, id]
  );
  return findItemById(id);
}

export async function deleteItem(id) {
  await pool.query('DELETE FROM items WHERE id = ?', [id]);
  return true;
}
