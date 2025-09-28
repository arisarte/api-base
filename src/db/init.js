import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const INIT_FLAG = path.join(process.cwd(), '.db_initialized');

export async function initDatabase() {
  // Se o arquivo de flag existir e não houver FORC e, pulamos a inicialização
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

  // 1. Conecta como root
  const rootConn = await mysql.createConnection({
    host: DB_HOST,
    port,
    user: DB_ROOT_USER,
    password: DB_ROOT_PASSWORD,
    multipleStatements: true
  });

  console.log('✅ Conectado como root ao servidor de banco');

  // 2. Cria DB e usuário
  const createDbSql = `
    CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
    CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY ?;
    GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';
    FLUSH PRIVILEGES;
  `;

  await rootConn.query(createDbSql, [DB_PASSWORD]);
  console.log(`✅ Database '${DB_NAME}' e usuário '${DB_USER}' prontos`);

  // 3. Conecta com usuário da API
  const db = await mysql.createConnection({
    host: DB_HOST,
    port,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
  });

  // 4. Cria tabelas se não existirem
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user','admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user_refresh FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    
    -- comments: may reference articles table which may or may not exist in this project
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      article_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // try adding FK constraints if articles table exists
  try {
    await db.query(`ALTER TABLE comments ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
  } catch (e) {
    // ignore if already exists or articles table missing
  }
  try {
    await db.query(`ALTER TABLE comments ADD CONSTRAINT fk_comments_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE`);
  } catch (e) {
    // ignore if articles table missing or constraint exists
  }

  console.log('✅ Tabelas mínimas (users, refresh_tokens) garantidas');

  // 5. Cria admin padrão se não existir
  const [rows] = await db.query('SELECT id FROM users WHERE email = ?', ['admin@local']);
  if (rows.length === 0) {
    const hashed = await bcrypt.hash('123456', 10);
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrador', 'admin@local', hashed, 'admin']
    );
    console.log("✅ Usuário admin padrão criado (email: admin@local / senha: 123456)");
  } else {
    console.log('ℹ️  Usuário admin já existe, pulando seed');
  }

  await rootConn.end();
  await db.end();

  // escrever flag
  try {
    fs.writeFileSync(INIT_FLAG, `initialized:${new Date().toISOString()}`);
    console.log(`✅ Arquivo de flag criado em ${INIT_FLAG}`);
  } catch (err) {
    console.warn('⚠️  Não foi possível criar arquivo de flag de inicialização:', err.message);
  }
}
