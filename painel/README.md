Painel Admin (leve)
===================

Como executar em desenvolvimento:

1. Instalar dependências

```bash
cd painel
npm install
npm run dev
```

2. Build e rodar em produção (local)

```bash
npm run build
npm run preview
```

3. Rodar via Docker Compose

```bash
docker compose up -d --build painel
```

O painel consulta a variável `VITE_API_URL` para descobrir o endpoint da API (definida no build args do compose).
