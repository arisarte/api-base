import { db } from '../db/knex.js';

export const cookiesRepository = {
  async save(ip, consent) {
    const [id] = await db('cookie_consents').insert({ ip, consent: JSON.stringify(consent) });
    return { id };
  },
  async findAll() {
    const rows = await db('cookie_consents').select('*').orderBy('updated_at', 'desc');
    return rows.map(r => ({ ...r, consent: JSON.parse(r.consent) }));
  }
};
