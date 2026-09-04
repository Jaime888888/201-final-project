# StudySpot backend setup

The backend is a Java 17 Spring Boot API backed by MySQL. It includes the Maven Wrapper, so a separate Maven installation is optional.

## Prerequisites

- Java 17
- Docker Desktop with Docker Compose

## Start locally

From `backend/demo`:

```bash
cp .env.example .env
```

Replace every password/signing-key placeholder in `.env`, then start MySQL and Adminer:

```bash
docker compose up -d
```

The shared local configuration uses:

- MySQL: `127.0.0.1:33061`
- Database: `appdb`
- Application user: `appuser`
- Adminer: `http://localhost:8081`

Run the API:

```bash
./mvnw spring-boot:run
```

On Windows, use `./mvnw.cmd spring-boot:run`. The API listens at `http://localhost:8080`.

## Verify

```bash
./mvnw test
./mvnw clean package
```

The test profile uses an in-memory H2 database and does not require Docker. GitHub Actions runs the backend tests and the frontend production build on every pull request and push to `main`.

## Stop local services

```bash
docker compose down
```

The MySQL data remains in the named Docker volume. Use `docker compose down --volumes` only when you intentionally want to reset local demo data.

## Configuration

Spring loads `backend/demo/.env` for local development. Deployed environments should provide the same values through their secret manager or process environment:

- `SPRING_DATASOURCE_URL`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_HOURS` (optional, defaults to 24)
- `CORS_ALLOWED_ORIGINS` (comma-separated, defaults to `http://localhost:3000`)

Never commit `.env`; it is ignored by Git.
