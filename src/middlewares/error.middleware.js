export default async function (app) {
  app.setErrorHandler((err, req, reply) => {
    app.log.error(err);
    const status = err.statusCode || 500;
    reply.status(status).send({
      success: false,
      message: err.message || 'Erro interno do servidor'
    });
  });
}
