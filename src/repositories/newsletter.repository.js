import { db } from '../db/knex.js';

export const newsletterRepository = {
  async create(email) {
    const [id] = await db('newsletter_subscribers').insert({ email });
    return { id };
  },
  async removeByEmail(email) {
    await db('newsletter_subscribers').where({ email }).del();
    return true;
  },
  async findAll() {
    return db('newsletter_subscribers').select('*').orderBy('created_at', 'desc');
  }
};
