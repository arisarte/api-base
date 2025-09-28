import { db } from '../db/knex.js';
import crypto from 'crypto';

export const webstoriesRepository = {
  async create({ title, description, slides, author_id }) {
    const id = crypto.randomBytes(12).toString('hex');
    await db('webstories').insert({ id, title, description, slides: JSON.stringify(slides), author_id });
    return { id, title, description, slides, author_id };
  },
  async findAll() {
    const rows = await db('webstories').select('*').orderBy('created_at', 'desc');
    return rows.map(r => ({ ...r, slides: JSON.parse(r.slides) }));
  },
  async findById(id) {
    const rows = await db('webstories').select('*').where({ id });
    if (!rows[0]) return null;
    const r = rows[0];
    return { ...r, slides: JSON.parse(r.slides) };
  },
  async remove(id) {
    await db('webstories').where({ id }).del();
  }
};
