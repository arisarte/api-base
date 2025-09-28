import { cookiesController } from '../controllers/cookies.controller.js';
import { validateSchema } from '../middlewares/validate-schema.js';
import { cookieConsentSchema, validateCookieConsent } from '../schemas/cookies.schema.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

export default async function cookiesRoutes(app) {
  // POST /accept - save consent
  app.post('/accept', async (req, reply) => {
    if (!(await validateSchema(validateCookieConsent)(req, reply))) return;
    return cookiesController.accept(req, reply);
  });

  // GET /policy - public cookie policy
  app.get('/policy', cookiesController.policy);

  // admin: list consents
  app.get('/consents', { preHandler: [verifyJWT, isAdmin] }, async (req, reply) => {
    const { cookiesService } = await import('../services/cookies.service.js');
    const data = await cookiesService.getAllConsents();
    reply.send({ success: true, data });
  });
}
