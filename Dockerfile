# Imagem base oficial do Node.js
FROM node:20-alpine

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json primeiro (para cache de dependências)
COPY package*.json ./

# Instalar dependências de produção
RUN npm install --omit=dev

# Copiar o restante do código
COPY . .

# Expor a porta da API
EXPOSE 4000

# Comando para rodar a aplicação
CMD ["node", "src/server.js"]
