# StudySpot Backend — Developer Environment Setup (VS Code)

This document explains how to set up the **exact backend development environment** used for the StudySpot backend.  
It is meant for developers using **VS Code** with:

- Spring Boot (Java 17)
- Maven
- MySQL (Docker)
- Adminer

---

# 1. Prerequisites

Install the following on your machine:

## Java 17

Mac (Homebrew):

```sh
brew install openjdk@17
```

Verify:

```sh
java -version
```

---

## Maven

Mac (Homebrew):

```sh
brew install maven
```

Verify:

```sh
mvn -v
```

---

## Docker Desktop

Download & install:

https://www.docker.com/products/docker-desktop/

Docker is required to run:
- MySQL database
- Adminer web UI

---

## Visual Studio Code

https://code.visualstudio.com/

Install the following extensions (search by name):

### Required VS Code Extensions

| Category | Extension |
|---------|-----------|
| Java + Spring | Spring Boot Extension Pack |
| Docker | Docker |
| SQL | SQLTools + SQLTools MySQL/MariaDB Driver |
| API Testing | Thunder Client (recommended) or REST Client |
| Misc | YAML, DotENV, GitLens |

---

# 2. Start the Local Database (Docker Compose)

To start MySQL + Adminer:

```sh
docker compose up -d
```

This launches:

### MySQL
- Host: localhost
- Port: 33061 (mapped to 3306)
- Database: appdb
- User: root
- Password: password

### Adminer UI
Visit:

```
http://localhost:8081
```

Login:
- System: MySQL
- Server: mysql
- Username: root
- Password: password
- Database: appdb


---

# 3. Running the Backend (Spring Boot)

## Option 1 — Using Maven

```sh
mvn spring-boot:run
```

## Option 2 — Using VS Code

1. Open `StudySpotApplication.java`
2. Click **Run** or **Debug** above the main method

Server runs at:

```
http://localhost:8080
```

---

# Common Commands

### Start database containers
```sh
docker compose up -d
```

### Stop containers
```sh
docker compose down
```

### Build JAR
```sh
mvn clean package
```

### Run tests
```sh
mvn test
```
