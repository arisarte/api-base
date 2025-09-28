import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const INIT_FLAG = path.join(process.cwd(), '.db_initialized');

export async function initDatabase() {
  const force = process.env.FORCE_DB_INIT === 'true';
  if (fs.existsSync(INIT_FLAG) && !force) {
    console.log('ℹ️  DB init já executado. Pulando (defina FORCE_DB_INIT=true para forçar).');
    return;
  }

  const {
    DB_HOST,
    DB_ROOT_USER,
    DB_ROOT_PASSWORD,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_PORT
  } = process.env;

  if (!DB_HOST || !DB_ROOT_USER || !DB_ROOT_PASSWORD || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    console.warn('⚠️  Variáveis de ambiente de DB incompletas. Pulando init do banco.');
    return;
  }

  const port = DB_PORT ? parseInt(DB_PORT, 10) : 3306;

  let rootConn;
  let db;
  try {
    // 1. Conecta como root
    rootConn = await mysql.createConnection({
      host: DB_HOST,
      port,
      user: DB_ROOT_USER,
      password: DB_ROOT_PASSWORD,
      multipleStatements: true
    });
    console.log('✅ Conectado como root ao servidor de banco');

    // 2. Cria DB e usuário (usa prepared param para a senha)
    const createDbSql = `
      CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
      CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY ?;
      GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';
      FLUSH PRIVILEGES;
    `;
    await rootConn.query(createDbSql, [DB_PASSWORD]);
    console.log(`✅ Database '${DB_NAME}' e usuário '${DB_USER}' prontos`);

    // 3. Conecta com usuário da API
    db = await mysql.createConnection({
      host: DB_HOST,
      port,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true
    });

    // 4. Criar tabelas principais
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user','admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        article_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabelas mínimas (users, refresh_tokens, comments) garantidas');

    // 5. Tentar criar constraints (se já existirem ou se tabelas dependentes não existirem, ignorar erros)
    try {
      await db.query(`ALTER TABLE refresh_tokens ADD CONSTRAINT fk_user_refresh FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
    } catch (e) {
      // constraint já existe ou não aplicável -> ignorar
    }

    try {
      await db.query(`ALTER TABLE comments ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
    } catch (e) {
      // ignorar
    }

    try {
      await db.query(`ALTER TABLE comments ADD CONSTRAINT fk_comments_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE`);
    } catch (e) {
      // se tabela articles não existir, ignore — será criada por migração/DDL do projeto
    }

    // 6. Index para consultas por article_id (MariaDB may not support IF NOT EXISTS; ignore errors)
    try {
      await db.query('CREATE INDEX idx_comments_article ON comments(article_id)');
    } catch (e) {
      // ignore
    }

    // 7. Seed admin padrão
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', ['admin@local']);
    if (rows.length === 0) {
      const hashed = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || '123456', 10);
      await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Administrador', 'admin@local', hashed, 'admin']);
      console.log("✅ Usuário admin padrão criado (email: admin@local)");
    } else {
      console.log('ℹ️  Usuário admin já existe, pulando seed');
    }

    // 8. fechar conexões
    await db.end();
    await rootConn.end();

    // escrever flag
    try {
      fs.writeFileSync(INIT_FLAG, `initialized:${new Date().toISOString()}`);
      console.log(`✅ Arquivo de flag criado em ${INIT_FLAG}`);
    } catch (err) {
      console.warn('⚠️  Não foi possível criar arquivo de flag de inicialização:', err.message);
    }
  } catch (err) {
    console.error('❌ Falha na inicialização do DB:', err.message);
    // tentar fechar conexões se abertas
    try { if (db && db.end) await db.end(); } catch (_) {}
    try { if (rootConn && rootConn.end) await rootConn.end(); } catch (_) {}
    throw err; // rethrow so caller (server) can decide
  }
}
