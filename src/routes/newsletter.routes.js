import { newsletterController } from '../controllers/newsletter.controller.js';
import { validateSchema } from '../middlewares/validate-schema.js';
import { validateNewsletter, newsletterSchema } from '../schemas/newsletter.schema.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

export default async function newsletterRoutes(app) {
  app.post('/subscribe', async (req, reply) => {
    if (!(await validateSchema(validateNewsletter)(req, reply))) return;
    return newsletterController.subscribe(req, reply);
  });

  app.post('/unsubscribe', async (req, reply) => {
    if (!(await validateSchema(validateNewsletter)(req, reply))) return;
    return newsletterController.unsubscribe(req, reply);
  });

  // simple list for admins could be added later
  app.get('/subscribers', { preHandler: [verifyJWT, isAdmin] }, async (req, reply) => {
    // lazy import service
    const { newsletterService } = await import('../services/newsletter.service.js');
    const list = await newsletterService.list();
    reply.send({ success: true, data: list });
  });
}
