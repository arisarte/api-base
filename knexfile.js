import dotenv from 'dotenv';
dotenv.config();

export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || process.env.DB_ROOT_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_ROOT_PASSWORD || '',
    database: process.env.DB_NAME || 'saudeline'
  },
  migrations: {
    directory: './migrations'
  }
};
