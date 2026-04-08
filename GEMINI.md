# GEMINI.md

## Project Overview

This project is a data catalog built with a **CKAN backend** and a **Next.js frontend**.
It's a Dockerized application that follows Infrastructure as Code principles, meaning the entire portal state is defined in configuration files within this repository.

**Core Technologies:**

*   **Backend:** CKAN 2.10+
*   **Frontend:** Next.js (React)
*   **Database:** PostgreSQL
*   **Search:** Solr
*   **Machine Learning:** TensorFlow
*   **Containerization:** Docker, Docker Compose

## Getting Started

### 1. Environment Setup

```bash
cp .env.example .env
```

### 2. Build and Run

```bash
docker compose up --build
```

### 3. Initialize Database

This command sets up the CKAN database and populates it with the initial data from `ckan/ckan-config.yaml`.

```bash
docker compose exec ckan python3 /srv/app/ckan-init.py
```

### 4. Access the Application

*   **Frontend:** [http://localhost:3000](http://localhost:3000)
*   **CKAN Backend:** [http://localhost:4000](http://localhost:4000)

## Development Workflow

### Infrastructure as Code

The portal's configuration (organizations, datasets, etc.) is managed in `ckan/ckan-config.yaml`. To apply changes, rerun the database initialization script.

### Frontend

The frontend is a standard Next.js application.

```bash
cd frontend
yarn dev
```

### Backend

The backend is a CKAN instance. Custom configurations are in the `ckan/` directory.

### Machine Learning

TensorFlow models are served via TensorFlow Serving. Models are located in `tensorflow/tf_serving_models`.

## Key Files

*   `README.md`: Main project documentation.
*   `docker-compose.yml`: Defines all services and their interactions.
*   `ckan/ckan.ini`: Base configuration for the CKAN backend.
*   `ckan/ckan-config.yaml`: Defines the initial state of the CKAN portal (IaC).
*   `frontend/package.json`: Frontend dependencies and scripts.
*   `frontend/app/`: Next.js application source code.
*   `tensorflow/`: TensorFlow models and related files.
