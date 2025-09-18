import { join } from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

export const uploadController = async (req, reply) => {
  try {
    const data = await req.file(); // fastify-multipart

    if (!data) {
      return reply.status(400).send({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    const ext = data.filename.split('.').pop();
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = join(process.cwd(), 'uploads', 'articles', fileName);

    // Garante que a pasta exista
    await fs.promises.mkdir(join(process.cwd(), 'uploads', 'articles'), { recursive: true });

    // Salva o arquivo
    await fs.promises.writeFile(filePath, await data.toBuffer());

    // Monta a URL pública usando APP_URL do .env
    const publicUrl = `${process.env.APP_URL}/uploads/articles/${fileName}`;

    return reply.send({
      success: true,
      message: 'Upload realizado com sucesso',
      file: publicUrl
    });

  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      success: false,
      message: 'Erro ao processar upload',
      error: error.message
    });
  }
};
