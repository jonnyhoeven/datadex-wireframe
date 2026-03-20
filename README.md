# CKAN Project with Repository-Based Configuration and Custom Frontend

This project is a Dockerized CKAN 2.10+ instance with a custom Next.js frontend designed for repository-based
configuration. It follows Infrastructure as Code principles, where the entire portal state is defined by the files in
this repository.

## Features

- **CKAN 2.10+**: Core CKAN platform.
- **Next.js Frontend**: Custom React-based interface (Data4OOV Catalogus).
- **Dockerized Architecture**: Simplified setup using Docker Compose.
- **Extensions Included**:
    - `ckanext-spatial`: Geospatial capabilities.
    - `ckanext-harvest`: Framework for harvesting datasets from other sources.
- **Environment Driven**: Configuration via environment variables and a base `ckan.ini`.

## Project Structure

- `frontend/`: Next.js frontend application source code.
- `Dockerfile`: Custom CKAN image building with required OS dependencies and extensions.
- `docker-compose.yml`: Defines `ckan`, `db` (PostgreSQL), `solr`, and `redis` services.
- `ckan.ini`: Base configuration file with environment variable placeholders.
- `.env.example`: Template for environment variables.
- `requirements.txt`: Python dependencies for CKAN and extensions.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

Follow these steps to set up the project on your local machine:

### 1. Configure Environment Variables

Copy the example environment file and adjust any settings if necessary (the defaults are usually fine for local
development):

```bash
cp .env.example .env
```

### 2. Build and Start the Services

Use Docker Compose to build the custom CKAN image and start all services, examples:

```bash
docker compose up
docker compose up --build
docker compose up frontend --force-recreate  --build
```

### 3. Initialize the Database and Automated Setup

The portal is configured to automatically initialize the database, create a sysadmin user, and apply the portal
configuration on startup.

**Default Admin Credentials:**

- **User**: `admin`
- **Password**: `password`
- **Email**: `admin@example.com`

These can be adjusted in `docker-compose.yml`.

### 4. Access the Portal

The services will be available at:

- **Frontend**: http://localhost:3000 (if running Next.js defaults)
- **CKAN Backend**: http://localhost:5000

### 5. Frontend development

To develop the frontend:

```bash
yarn run dev
```

The rest is just fluff... containers, config, and scripts, see the individual
services: [frontend](frontend), [ckan](ckan), [db](db).

## Infrastructure as Code: Configuring the Portal

The state of the portal (organizations, groups, datasets, and harvesters) is defined in `portal-config.yaml`. This
follows IaC principles, and the configuration is automatically applied when the CKAN container starts.

### 1. Define your configuration

Edit `portal-config.yaml` to include the entities you want to create:

```yaml
organizations:
  - name: "my-org"
    title: "My Organization"

groups:
  - name: "my-group"
    title: "My Group"

datasets:
  - name: "my-dataset"
    title: "My Dataset"
    owner_org: "my-org"
    groups: [ { name: "my-group" } ]
    resources:
      - name: "Data"
        url: "http://example.com/data.csv"

harvesters:
  - name: "ckan-harvester"
    url: "https://demo.ckan.org"
    type: "ckan"
```

### 2. Apply changes

If you update `portal-config.yaml` while the container is running, you can:

1. **Restart the container**:
   ```bash
   docker compose restart ckan
   ```
   The configuration will be reapplied on startup.

2. **Manually run the setup script**:
   ```bash
   docker compose exec ckan python3 /srv/app/setup-portal.py
   ```
   (The script will automatically generate an API token for the sysadmin user if `CKAN_API_KEY` is not provided).

## Common Commands

- **Stop services**: `docker compose stop`
- **View logs**: `docker compose logs -f ckan`
- **Restart a service**: `docker compose restart ckan`
- **Run CKAN CLI commands**: `docker compose exec ckan ckan -c /srv/app/ckan.ini <command>`

## Configuration

Most configuration settings can be managed via the `.env` file. These variables are passed to the `ckan.ini` file using
placeholders like `${CKAN_SITE_URL}`.

## Volumes

The following local volumes are mapped for data persistence:

    - `ckan_storage`: Stores uploaded resources and files.
    - `pg_data`: Stores the PostgreSQL database files.
    - `./ckan.ini`: Mapped to `/srv/app/ckan.ini` inside the container for live configuration updates.

### Note on Environment Variables

The following environment variables are mandatory and should be set in your `.env` file:

- `CKAN_SITE_URL`: The URL of your CKAN instance.
- `POSTGRES_PASSWORD`: The password for the PostgreSQL database.
- `CKAN_BEAKER_SESSION_SECRET`: A secret string used for session encryption.
