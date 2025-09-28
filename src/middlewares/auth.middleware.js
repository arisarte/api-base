import jwt from 'jsonwebtoken';

export function authMiddleware(req, reply, done) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return reply.code(401).send({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  if (!token) return reply.code(401).send({ error: 'Token inválido' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // guarda usuário no request
    done();
  } catch (err) {
    return reply.code(401).send({ error: 'Token expirado ou inválido' });
  }
}

// Compatibilidade retroativa: algumas rotas importavam `verifyJWT`
export const verifyJWT = authMiddleware;
