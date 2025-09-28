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

Notas de admin
- Para usar ações administrativas (deletar, criar webstories, listar subscritos), o painel envia o header `Authorization: Bearer <token>` se existir `localStorage.admin_token`.
- Gere um token de administrador usando o endpoint de login (`/v1/auth/login`) com um usuário que tenha `role: 'admin'` e cole o accessToken em `localStorage` via DevTools ou implementamos uma tela de login no painel.
