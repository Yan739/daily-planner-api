# Daily Planner - Backend API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-005C84?logo=mysql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-FE0803?logo=typeorm&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

> **REST API for the Daily Planner app - built with NestJS, TypeORM, and MySQL.**
> Manages tasks, goals, notes, and hourly schedule entries, each scoped to a calendar date.

---

## At a glance (for reviewers & recruiters)

Daily Planner API is a **backend-only project** built with NestJS, demonstrating clean module separation, typed data validation, and database-agnostic persistence through an ORM.

**What it demonstrates**

- **NestJS modular architecture**: Four independent feature modules (`task`, `goal`, `note`, `schedule`) each own their entity, DTO, service, and controller - no cross-module coupling. Adding a fifth resource follows the exact same structure.
- **Input validation with class-validator**: Every incoming request body is validated by a DTO before reaching the service layer. Required fields, type constraints, and value ranges (`@Min(1)` / `@Max(5)` on goal priority) are declared declaratively with decorators.
- **Safe partial updates**: The `update` methods build an explicit `Partial<Entity>` from only the fields present in the request, so a PUT that omits an optional field never accidentally clears it.
- **TypeORM + MySQL**: Entities map directly to database tables via decorators. `autoLoadEntities` means no manual entity list - each module registers its own entity via `TypeOrmModule.forFeature()`.
- **Swagger UI**: The OpenAPI spec is auto-generated from the code and exposed at `/api` for interactive endpoint testing without any separate HTTP client.
- **Docker Compose**: A `compose.yaml` spins up the app and a MySQL instance together - zero local setup required.
- **Environment-driven config**: All secrets (DB host, credentials, port) come from `.env` via `@nestjs/config`; nothing is hardcoded.

**Stack:** NestJS · TypeScript · TypeORM · MySQL 8 · Swagger · Docker Compose

---

## Architecture

```
src/
├── task/
│   ├── dto/task.dto.ts         # Input validation (CreateTaskDto, UpdateTaskDto)
│   ├── task.controller.ts      # REST endpoints (POST / GET / PUT / DELETE)
│   ├── task.entity.ts          # TypeORM entity → tasks table
│   ├── task.module.ts          # Module wiring
│   └── task.service.ts         # Business logic & DB access
├── goal/                       # Same structure as task/
├── note/                       # Same structure as task/
├── schedule/                   # Same structure as task/
├── app.module.ts               # Root module - TypeORM + ConfigModule setup
└── main.ts                     # Bootstrap, CORS, Swagger
```

Each resource follows the same layered pattern:

| Layer | File | Responsibility |
|---|---|---|
| Controller | `*.controller.ts` | HTTP routing, 404 handling, parameter parsing |
| Service | `*.service.ts` | Business rules, partial-update logic, DB calls |
| Entity | `*.entity.ts` | Table schema declared with TypeORM decorators |
| DTO | `dto/*.dto.ts` | Request body shape and validation rules |

---

## API Endpoints

All resources expose the same five operations:

| Method | Path | Description |
|---|---|---|
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks` | List all tasks (add `?date=YYYY-MM-DD` to filter by day) |
| `GET` | `/tasks/:id` | Get one task (404 if missing) |
| `PUT` | `/tasks/:id` | Partial update - omitted fields are not cleared |
| `DELETE` | `/tasks/:id` | Delete a task |

Replace `/tasks` with `/goals`, `/notes`, or `/schedules` for the other resources. All four follow the same contract.

The `GET /health` endpoint is available as a liveness probe (returns `{ status, timestamp, uptime }`).

Interactive docs are available at `http://localhost:3000/api` once the app is running (Swagger UI).

---

## Getting Started

### Option 1 - Docker Compose (recommended, zero local setup)

```bash
git clone https://github.com/Yan739/daily-planner-api.git
cd daily-planner-api
cp .env.example .env   # fill in your values, or leave the defaults for local dev
docker compose up
```

The API starts at `http://localhost:3000`. MySQL is provisioned automatically.

### Option 2 - Local Node

**Prerequisites:** Node 20+, MySQL 8 running locally.

```bash
git clone https://github.com/Yan739/daily-planner-api.git
cd daily-planner-api
npm install
cp .env.example .env   # set DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
npm run start:dev
```

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | MySQL hostname | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | Database user | - |
| `DB_PASS` | Database password | - |
| `DB_NAME` | Database name | - |

### Running tests

```bash
npm run test          # unit tests (Jest)
npm run test:cov      # with coverage report
npm run test:e2e      # end-to-end tests
```