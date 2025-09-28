# API Endpoints (saudeline)

Base path: /v1

Auth
- POST /v1/auth/register { name, email, password }
- POST /v1/auth/login { email, password } -> { accessToken, refreshToken }
- POST /v1/auth/refresh { token } -> { accessToken, refreshToken }
- POST /v1/auth/logout { token }

Users
- GET /v1/users
- GET /v1/users/:id
- POST /v1/users
- PUT /v1/users/:id
- DELETE /v1/users/:id

Articles
- GET /v1/articles
- GET /v1/articles/:id
- POST /v1/articles (auth required)
- PUT /v1/articles/:id (auth required)
- DELETE /v1/articles/:id (auth required)

Categories
- GET /v1/categories
- GET /v1/categories/:id
- POST /v1/categories
- PUT /v1/categories/:id
- DELETE /v1/categories/:id
