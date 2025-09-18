// src/routes/upload.routes.js
import { uploadController } from '../controllers/upload.controller.js';

export default async function uploadRoutes(app) {
  // Rota para upload de artigos
  app.post('/articles', {
    schema: {
      consumes: ['multipart/form-data'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            fileUrl: { type: 'string' }
          }
        }
      }
    }
  }, uploadController);
}
