// src/server.js

// 1️⃣ Carregar variáveis de ambiente antes de qualquer outro módulo
import dotenv from 'dotenv';
dotenv.config();

// 2️⃣ Imports principais
import { buildApp } from './app.js';
import { env } from './config/env.js';

// 3️⃣ Tratamento global de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('💥 Erro não tratado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Promessa rejeitada sem tratamento:', reason);
  process.exit(1);
});

// 4️⃣ Validação de variáveis obrigatórias
if (!env.port) {
  console.error('❌ Variável de ambiente PORT não definida.');
  process.exit(1);
}

// 5️⃣ Inicialização do app Fastify
const app = buildApp();

// 6️⃣ Start do servidor
app.listen({ port: env.port, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`🚀 API Saudeline iniciada com sucesso`);
    app.log.info(`📡 Escutando em http://0.0.0.0:${env.port}`);
  })
  .catch((err) => {
    console.error('❌ Erro ao iniciar o servidor:', err); // imprime stack trace
    process.exit(1);
  });

// 7️⃣ Encerramento limpo no Docker/Swarm
const shutdown = async (signal) => {
  try {
    app.log.info(`📴 Recebido sinal ${signal}, encerrando...`);
    await app.close();
    process.exit(0);
  } catch (err) {
    app.log.error('Erro ao encerrar o servidor:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
