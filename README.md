# CKAN Project with Repository-Based Configuration

This project is a Dockerized CKAN 2.10+ instance designed for repository-based configuration. It follows Infrastructure as Code principles, where the entire portal state is defined by the files in this repository.

## Features

- **CKAN 2.10+**: Core CKAN platform.
- **Dockerized Architecture**: Simplified setup using Docker Compose.
- **Extensions Included**:
  - `ckanext-spatial`: Geospatial capabilities.
  - `ckanext-harvest`: Framework for harvesting datasets from other sources.
- **Environment Driven**: Configuration via environment variables and a base `ckan.ini`.

## Project Structure

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

Copy the example environment file and adjust any settings if necessary (the defaults are usually fine for local development):

```bash
cp .env.example .env
```

### 2. Build and Start the Services

Use Docker Compose to build the custom CKAN image and start all services:

```bash
docker compose up -d --build
```

### 3. Initialize the Database (First time only)

Once the containers are running, you may need to initialize the CKAN database and create a sysadmin user.

**Create a sysadmin user:**

```bash
docker compose exec ckan ckan -c /srv/app/ckan.ini sysadmin add admin email=admin@example.com password=password
```

### 4. Access the Portal

The CKAN instance will be available at: [http://localhost:5000](http://localhost:5000)

## Common Commands

- **Stop services**: `docker compose stop`
- **View logs**: `docker compose logs -f ckan`
- **Restart a service**: `docker compose restart ckan`
- **Run CKAN CLI commands**: `docker compose exec ckan ckan -c /srv/app/ckan.ini <command>`

## Configuration

Most configuration settings can be managed via the `.env` file. These variables are passed to the `ckan.ini` file using placeholders like `${CKAN_SITE_URL}`.

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
