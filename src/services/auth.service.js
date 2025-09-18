import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const authService = {
  async login({ username, password }) {
    // ⚠️ Substituir por validação real (ex: banco de dados)
    if (username !== 'admin' || password !== 'senha938275087') {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }

    const payload = { username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { token };
  },

  verify(token) {
    return jwt.verify(token, JWT_SECRET);
  }
};
