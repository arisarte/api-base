export function isAdmin(req, reply, done) {
  if (req.user && req.user.role === 'admin') {
    return done();
  }
  return reply.code(403).send({ error: 'Acesso negado: apenas administradores' });
}
