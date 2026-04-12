# CKAN Project with Repository-Based Configuration and Custom Frontend

This project is a Dockerized CKAN 2.10+ instance with a custom Next.js frontend designed for repository-based
configuration. It follows Infrastructure as Code principles, where the entire portal state is defined by the files in
this repository.

## Features

- **CKAN 2.10+**: Core CKAN platform.
- **Next.js Frontend**: Custom React-based interface (Data4OOV Catalog).
- **Dockerized Architecture**: Simplified setup using Docker Compose.
- **Extensions Included**:
    - `ckanext-spatial`: Geospatial capabilities.
    - `ckanext-harvest`: Framework for harvesting datasets from other sources.
- **Environment Driven**: Configuration via environment variables and a base `ckan.ini`.

## Project Structure

- `frontend/`: Next.js frontend application source code.
- `docker-compose.yml`: Defines `frontend`, `ckan`, `db (PostgreSQL)`, `solr`, `redis`, and some demo `tensorflow stuff` services.
- `ckan.ini`: Base configuration file with environment variable placeholders.
- `.env.example`: Template for environment variables.
- `requirements.txt`: Python dependencies for CKAN and extensions.

## Prerequisites

This project utilizes a **Nix Flake** and **direnv** to provide a consistent development environment across all services. 

### ❄️ Nix Managed (Automatic)
These tools are automatically provided by the project's shell:
1.  **Node.js (v24)** & **Yarn**
2.  **Python (v3.11)** & **Ruff**
3.  **Docker CLI** & **Docker Compose**

### 🛠 Manual Installations
These tools must be installed manually on your system:
1.  **[Nix](https://nixos.org/download/)**: For package management.
2.  **[direnv](https://direnv.net/docs/installation.html)**: For automatic environment switching.
3.  **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (or OrbStack): Required to run the containers on macOS.
4.  **[Antigravity AI](https://github.com/google-deepmind/antigravity)**: The AI coding assistant for this repository.

## Quick Start

Follow these steps to set up the project:

### 1. Initialize the Development Environment

Once Nix and Direnv are installed, `cd` into the project root and allow the environment:

```bash
direnv allow
```

This will automatically load Node 24, Yarn, Python 3.11, and the Docker CLI into your shell.

### 2. Configure Environment Variables

Copy the example environment file and adjust any settings if necessary (the defaults are usually fine for local
development):

```bash
cp .env.example .env
```

### 3. Build and Start the Services

Use Docker Compose to build the custom CKAN image and start all services, examples:

```bash
docker compose up
docker compose up --build
docker compose up frontend --force-recreate --build
```

### 4. Initialize the Database and Automated Setup

You can initialize/bootstrap ckan using the following command: 

```bash
docker compose exec ckan python3 /srv/app/ckan-init.py
```

**Default Admin Credentials:**

- **User**: `admin`
- **Password**: `password`
- **Email**: `admin@example.com`

These can be adjusted through env variables.

### 5. Access the Portal

The services will be available at:

- **Frontend**: http://localhost:3000 If not using the container, check `./frontend`
- **CKAN Backend**: http://localhost:4000

## Infrastructure as Code: Configuring the Portal

The state of the portal (organizations, groups, datasets, and harvesters) is defined in `ckan-config.yaml`. This
follows IaC principles, and the configuration is automatically applied when the CKAN container starts.

### 1. Define your configuration

Edit `ckan/ckan-config.yaml` to include the entities you want to create:

### 2. Apply changes

If you update `ckan-config.yaml` while the container is running, make sure you rerun:

```bash
docker compose exec ckan python3 /srv/app/ckan-init.py
```

To run Harvester see [ckanext-harvester](https://github.com/ckan/ckanext-harvest/blob/master/README.rst#harvester-run)

```bash
docker compose exec ckan ckan --config=/srv/app/ckan.ini harvester gather-consumer
docker compose exec ckan ckan --config=/srv/app/ckan.ini harvester fetch-consumer
docker compose exec ckan ckan --config=/srv/app/ckan.ini harvester run
```

## Common Commands

- **Stop services**: `docker compose stop`
- **View logs**: `docker compose logs -f ckan`
- **Restart a service**: `docker compose restart ckan`
- **Run CKAN CLI commands**: `docker compose exec ckan ckan -c /srv/app/ckan.ini <command>`

## Configuration

Most configuration settings can be managed via the `.env` file. These variables are passed to the `ckan.ini` file using
placeholders like `${CKAN_SITE_URL}`.
