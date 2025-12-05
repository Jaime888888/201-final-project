# StudySpot API Guide

Base URL
- https://studyspot.online/api

Auth overview
- JWT-based auth. Tokens are issued by [`com.studyspotfinder.controller.AuthController`](src/main/java/com/studyspotfinder/controller/AuthController.java) using [`com.studyspotfinder.security.JwtService`](src/main/java/com/studyspotfinder/security/JwtService.java).
- The JWT subject is the user's email. Default expiration is 24 hours (see [`com.studyspotfinder.security.JwtService`](src/main/java/com/studyspotfinder/security/JwtService.java)).
- All non-/auth endpoints are protected by [`com.studyspotfinder.security.JwtAuthenticationFilter`](src/main/java/com/studyspotfinder/security/JwtAuthenticationFilter.java) and require the header: Authorization: Bearer <token>. The filter grants ROLE_USER.
- Example secured controller: [`com.studyspotfinder.controller.UserController`](src/main/java/com/studyspotfinder/controller/UserController.java) (requires hasRole('USER')). User model: [`com.studyspotfinder.model.User`](src/main/java/com/studyspotfinder/model/User.java).

NOTE: Frontend needs to be configured to handle 400/401/403 error codes when unauthorized API calls are made
---
Endpoints

- POST /auth/register
  - Request JSON:
    {
      "username": "jane",
      "email": "jane@example.com",
      "password": "secret123"
    }
  - Response 200:
    {
      "token": "<jwt>",
      "user": { "id": 1, "username": "jane", "email": "jane@example.com" }
    }
  - 400 if email already exists.

- POST /auth/login
  - Request JSON:
    {
      "email": "jane@example.com",
      "password": "secret123"
    }
  - Response 200:
    {
      "token": "<jwt>",
      "user": { "id": 1, "username": "jane", "email": "jane@example.com" }
    }
  - 401 if invalid credentials.

- GET /users (secured) (this is a test non auth endpoint that just shows all users in db)
  - Header: Authorization: Bearer <jwt>
  - Response 200: JSON array of users.

Quick curl examples

- Register:
  curl -X POST https://studyspot.online/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"jane","email":"jane@example.com","password":"secret123"}'

- Login:
  curl -X POST https://studyspot.online/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"jane@example.com","password":"secret123"}'

- Call a secured endpoint:
  TOKEN="<jwt>"
  curl https://studyspot.online/api/users \
    -H "Authorization: Bearer $TOKEN"

Frontend usage

- On register/login, save token from response.
- Include the token in Authorization header for all subsequent API calls (except /auth/*).

Example (fetch)

- Login and store token:
  const login = async (email, password) => {
    const res = await fetch("https://studyspot.online/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data.user;
  };

- Authenticated request:
  const apiFetch = (path, options = {}) => {
    const token = localStorage.getItem("token");
    return fetch(`https://studyspot.online/api${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Example:
  const getUsers = async () => {
    const res = await apiFetch("/users");
    if (res.status === 401) {
      // handle re-auth
    }
    return res.json();
  };

Token details

- Subject: user email.
- Expiration: jwt.expiration-hours (default 24h).
- Validation/signing: HMAC key from jwt.secret (see [`com.studyspotfinder.security.JwtService`](src/main/java/com/studyspotfinder/security/JwtService.java)).

CORS notes

- Auth endpoints currently allow origin http://localhost:3000 (see [`com.studyspotfinder.controller.AuthController`](src/main/java/com/studyspotfinder/controller/AuthController.java)). Adjust as needed for your frontend origin if calling cross-origin. Same-origin requests from https://studyspot.online do not require CORS.

Implementation references

- [`com.studyspotfinder.controller.AuthController`](src/main/java/com/studyspotfinder/controller/AuthController.java)
- [`com.studyspotfinder.security.JwtService`](src/main/java/com/studyspotfinder/security/JwtService.java)
- [`com.studyspotfinder.security.JwtAuthenticationFilter`](src/main/java/com/studyspotfinder/security/JwtAuthenticationFilter.java)
- [`com.studyspotfinder.controller.UserController`](src/main/java/com/studyspotfinder/controller/UserController.java)
- [`com.studyspotfinder.model.User`](src/main/java/com/studyspotfinder/model/User.java)
