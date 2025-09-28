# API Endpoints (saudeline)
```markdown
# API Endpoints (saudeline)

Base path: /v1

Auth
- POST /v1/auth/register { name, email, password }
- POST /v1/auth/login { email, password } -> { accessToken, refreshToken, user }
- POST /v1/auth/refresh { token } -> { accessToken, refreshToken }
- POST /v1/auth/logout { token }

Users
- GET /v1/users                     -> list public user profiles (id, name, email, role)
- GET /v1/users/:id                 -> get a single user profile (public)
- PUT /v1/users/:id                 -> update profile (auth required; only owner or admin)

Comments
- POST /v1/comments                 -> create comment (auth required)
	 body: { article_id: number, content: string }
- GET /v1/comments/article/:articleId -> list comments for an article (public)
- DELETE /v1/comments/:id           -> delete comment (auth required; owner or admin)

Articles
- GET /v1/articles
- GET /v1/articles/:id
- GET /v1/articles/:id/comments     -> list comments for an article (public)
- POST /v1/articles (auth required)
- PUT /v1/articles/:id (auth required)
- DELETE /v1/articles/:id (auth required)

Categories
- GET /v1/categories
- GET /v1/categories/:id
- POST /v1/categories
- PUT /v1/categories/:id
- DELETE /v1/categories/:id

---

Newsletter
- POST /v1/newsletter/subscribe      -> subscribe with { email }
- POST /v1/newsletter/unsubscribe    -> unsubscribe with { email }

Cookies
- POST /v1/cookies/accept            -> save cookie consent { consent: { analytics: boolean } }
- GET  /v1/cookies/policy            -> get public cookie policy

Webstories
- GET  /v1/webstories                -> list webstories (public)
- GET  /v1/webstories/:id            -> get single webstory (public)
- POST /v1/webstories                -> create webstory (admin only, auth)
- DELETE /v1/webstories/:id         -> delete webstory (admin only, auth)


Authentication notes
- All modifying endpoints require Authorization: Bearer <accessToken> header.
- Access tokens expire (default 1h). Use the refresh token endpoints to rotate and obtain new tokens.
- The backend stores hashed refresh tokens; rotation is used on refresh. Always keep refresh tokens private.

Examples (PowerShell - Invoke-RestMethod)

# 1) Register
Invoke-RestMethod -Method Post -Uri http://localhost:4000/v1/auth/register -ContentType 'application/json' -Body (ConvertTo-Json @{name='Alice'; email='alice@example.local'; password='secret'})

# 2) Login -> get tokens
$login = Invoke-RestMethod -Method Post -Uri http://localhost:4000/v1/auth/login -ContentType 'application/json' -Body (ConvertTo-Json @{email='alice@example.local'; password='secret'})
$access = $login.accessToken
$refresh = $login.refreshToken

# 3) Create a comment (auth required)
Invoke-RestMethod -Method Post -Uri http://localhost:4000/v1/comments -Headers @{ Authorization = "Bearer $access" } -ContentType 'application/json' -Body (ConvertTo-Json @{article_id=5; content='Gostei muito deste artigo!'})

# 4) List comments for article 5 (public)
Invoke-RestMethod -Method Get -Uri http://localhost:4000/v1/comments/article/5

# 5) Refresh tokens
Invoke-RestMethod -Method Post -Uri http://localhost:4000/v1/auth/refresh -ContentType 'application/json' -Body (ConvertTo-Json @{token=$refresh})

# 6) Logout (revoke refresh token)
Invoke-RestMethod -Method Post -Uri http://localhost:4000/v1/auth/logout -ContentType 'application/json' -Body (ConvertTo-Json @{token=$refresh})

---

Database (MariaDB)
- users table:
```sql
CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(150) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	role ENUM('user','admin') DEFAULT 'user',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- comments table, 
```sql
CREATE TABLE comments (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	article_id INT NOT NULL,
	content TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);
```

Notes
- DB initialization: the API includes an init path that creates DB/tables and seeds an admin user when the server starts (see `src/db/init.js`). If you run the app in Docker Compose, ensure Docker Desktop is running and `DB_HOST` is set correctly (container: `mariadb`, host-mode: `127.0.0.1`).

---

If you want, I can also add request body validation (AJV) for comment creation and a small integration test that runs the happy path (register -> login -> create comment -> list -> delete).

```
