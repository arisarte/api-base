// src/routes/health.routes.js
import { config } from '../config/config.js';

export default async function healthRoutes(app) {
  app.get('/health', async (req, reply) => {
    const status = {
      api: 'ok',
      db: 'unknown',
      disk: 'unknown'
    };

    // Teste DB com import dinâmico protegido
    try {
      const mariadb = await import('mariadb');
      const pool = mariadb.createPool({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
        connectionLimit: 1
      });

      const conn = await pool.getConnection();
      await conn.query('SELECT 1');
      conn.release();
      status.db = 'ok';
    } catch (err) {
      status.db = 'error';
      status.dbError = err?.message || 'Falha ao testar conexão com o banco';
    }

    // Teste espaço em disco com import dinâmico protegido
    try {
      const { default: checkDiskSpace } = await import('check-disk-space');
      const disk = await checkDiskSpace('/');
      status.disk = {
        free: `${(disk.free / 1024 / 1024 / 1024).toFixed(2)} GB`,
        size: `${(disk.size / 1024 / 1024 / 1024).toFixed(2)} GB`
      };
    } catch (err) {
      status.disk = 'error';
      status.diskError = err?.message || 'Falha ao verificar espaço em disco';
    }

    // Sempre responde, mesmo com erros
    reply.code(status.db === 'ok' ? 200 : 500).send(status);
  });
}
