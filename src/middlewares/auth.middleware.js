import { authService } from '../services/auth.service.js';

export async function verifyJWT(req, reply) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.code(401).send({ success: false, message: 'Token ausente ou inválido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = authService.verify(token);
  } catch (err) {
    reply.code(401).send({ success: false, message: 'Token expirado ou inválido' });
  }
}
