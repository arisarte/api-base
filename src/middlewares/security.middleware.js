import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';

export async function registerSecurity(app) {
  // Rate limit: 100 requisições por 15 minutos por IP
  app.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
    allowList: ['127.0.0.1'], // IPs liberados (ex.: monitoramento interno)
    errorResponseBuilder: (req, context) => ({
      success: false,
      message: `Limite de ${context.max} requisições em ${context.after} atingido`
    })
  });

  // Helmet: cabeçalhos de segurança
  await app.register(helmet, {
    contentSecurityPolicy: false // pode ajustar conforme necessidade
  });
}
