import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js'; // usa teu pool do MariaDB

const usersTable = 'users';
const refreshTable = 'refresh_tokens';

export const authController = {
  // Criar novo usuário
  async register(req, reply) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return reply.code(400).send({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se email já existe
    const [existing] = await pool.query(`SELECT id FROM ${usersTable} WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return reply.code(400).send({ error: 'Email já registrado' });
    }

    // Hash da senha
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO ${usersTable} (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [name, email, hashed, 'user']
    );

    return reply.send({ message: 'Usuário registrado com sucesso' });
  },

  // Login
  async login(req, reply) {
    const { email, password } = req.body;

    const [rows] = await pool.query(`SELECT * FROM ${usersTable} WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return reply.code(401).send({ error: 'Credenciais inválidas' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return reply.code(401).send({ error: 'Credenciais inválidas' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    // Salvar hash do refresh token (não o token em texto)
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await pool.query(
      `INSERT INTO ${refreshTable} (user_id, token) VALUES (?, ?)`,
      [user.id, refreshHash]
    );

    return reply.send({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  },

  // Refresh token
  async refreshToken(req, reply) {
    const { token } = req.body;
    if (!token) return reply.code(400).send({ error: 'Token de atualização é obrigatório' });

    // Como armazenamos hash dos tokens, precisamos buscar tokens do usuário
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await pool.query(`SELECT * FROM ${refreshTable} WHERE user_id = ?`, [payload.id]);
      if (rows.length === 0) return reply.code(401).send({ error: 'Token inválido' });

      // encontrar um hash que combine
      let matched = null;
      for (const row of rows) {
        // row.token é o hash
        // eslint-disable-next-line no-await-in-loop
        const ok = await bcrypt.compare(token, row.token);
        if (ok) {
          matched = row;
          break;
        }
      }

      if (!matched) return reply.code(401).send({ error: 'Token inválido' });

      // Rotacionar: gerar novo refresh token e substituir o hash do registro
      const newAccessToken = jwt.sign({ id: payload.id, role: payload.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
      const newRefreshToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
      const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);

      await pool.query(`UPDATE ${refreshTable} SET token = ? WHERE id = ?`, [newRefreshHash, matched.id]);

      return reply.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      return reply.code(401).send({ error: 'Token expirado ou inválido' });
    }
  },

  // Logout
  async logout(req, reply) {
    const { token } = req.body;
    if (!token) return reply.code(400).send({ error: 'Token de atualização é obrigatório' });

    // Como gravamos hash, precisamos procurar por matching hash e deletar
    const [rows] = await pool.query(`SELECT * FROM ${refreshTable}`);

    let deleted = false;
    for (const row of rows) {
      // eslint-disable-next-line no-await-in-loop
      const ok = await bcrypt.compare(token, row.token);
      if (ok) {
        await pool.query(`DELETE FROM ${refreshTable} WHERE id = ?`, [row.id]);
        deleted = true;
        break;
      }
    }

    if (!deleted) return reply.code(400).send({ error: 'Token não encontrado' });
    return reply.send({ message: 'Logout realizado com sucesso' });
  }
};
