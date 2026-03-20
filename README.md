# Data4OOV Catalogus Backend

This project is a Node.js (Fastify) backend for the Data4OOV Catalogus. It serves static frontend files, provides a metadata API via Prisma ORM and PostgreSQL, and includes a proxy route for MapProxy/GeoServer with user scoping support.

## Features

- **Fastify Web Server**: High-performance backend with dynamic routing.
- **Prisma ORM & PostgreSQL**: Database schema and migrations for 'Risico Index Natuurbranden' (RIN) dataset.
- **User Scoping**: Automatic extraction of user identity via the `X-Forwarded-User` header.
- **Proxy Middleware**: Securely forward requests to MapProxy/GeoServer while appending user scope filters.
- **Clean Architecture**: Organized into `routes/`, `plugins/`, `prisma/`, and `static/` folders.

## Project Structure

```text
.
├── index.js          # Entry point and server configuration
├── package.json       # Project dependencies and scripts
├── prisma/            # Database schema, migrations, and seed script
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── plugins/           # Fastify plugins (Auth, Prisma)
├── routes/            # API routes (Catalog metadata)
├── static/            # Static frontend files (index.html)
└── docker-compose.yaml # Infrastructure (PostGIS, MapProxy, GeoServer)
```

## Prerequisites

- **Node.js**: v18+ (tested with v20+)
- **Docker & Docker Compose**: For running PostgreSQL (PostGIS) and GIS services.

## Setup & Installation

1.  **Clone the repository** (or navigate to the project folder).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    Create or update the `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:pass@localhost:5432/gis_db?schema=public"
    MAPPROXY_URL="http://mapproxy:8080"
    GEOSERVER_URL="http://geoserver:8080/geoserver"
    PORT=3000
    HOST=0.0.0.0
    ```
4.  **Spin up infrastructure**:
    ```bash
    docker-compose up -d
    ```
5.  **Run Database Migrations**:
    For development:
    ```bash
    npx prisma migrate dev --name init
    ```
    For production (applying existing migrations):
    ```bash
    npx prisma migrate deploy
    ```
6.  **Seed the database**:
    ```bash
    npm run seed
    ```

## Running the Application

- **Development Mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

The application will be available at `http://localhost:3000`.

## Automated Migrations

The `app-frontend` Docker container is configured to automatically run `npx prisma migrate deploy` upon startup via the `start.sh` script. This ensures that the database schema is always in sync with the current codebase without manual intervention during deployment.

## API Endpoints

- `GET /`: Serves the catalog frontend.
- `GET /api/metadata`: Fetches catalog metadata from PostgreSQL.
- `GET /api/rin-dataset`: Fetches the RIN dataset with user-based filtering.
- `GET /proxy/mapproxy/*`: Proxies requests to MapProxy, automatically appending `user_scope` from the `X-Forwarded-User` header.
- `GET /proxy/geoserver/*`: Proxies requests to GeoServer, automatically appending `user_scope` from the `X-Forwarded-User` header.

## User Scoping & Authentication

The backend is designed to sit behind an **OAuth2 Proxy**. It expects an `X-Forwarded-User` header.
- If the header is missing, it defaults to `anonymous`.
- The `user_scope` is automatically appended to proxy requests to MapProxy and GeoServer to ensure data isolation.
