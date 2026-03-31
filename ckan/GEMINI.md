# CKAN Backend - GEMINI.md

## Project Overview

This directory contains the **CKAN backend** for the data catalog. It is a customized CKAN 2.10 instance designed to manage metadata, organizations, and datasets. It leverages several powerful extensions for spatial data, harvesting, and DCAT compatibility.

**Core Technologies:**
*   **Base Image:** `ckan/ckan-base:2.10`
*   **Extensions:** 
    *   `ckanext-spatial`: Geospatial support (PostGIS).
    *   `ckanext-harvest`: Remote metadata harvesting.
    *   `ckanext-dcat`: DCAT-AP metadata profile support.
    *   `ckanext-scheming`: Custom metadata schemas.
    *   `ckanext-geoview`: Geospatial data previews.
    *   `ckanext-check-link`: Automated link validation for resources.

## Infrastructure as Code (IaC)

The state of the CKAN portal (organizations, groups, datasets, and harvesters) is managed declaratively through configuration files.

*   **`ckan-config.yaml`**: The primary source of truth for the portal's initial state.
*   **`ckan-init.py`**: A synchronization script that uses the CKAN API to ensure the portal state matches `ckan-config.yaml`.

### To Apply Configuration Changes:
Run the following command within the running `ckan` container:
```bash
python3 /srv/app/ckan-init.py
```
*(Note: This command is typically orchestrated by the root `docker-compose.yml` or run manually after deployment.)*

## Key Files

*   **`ckan.ini`**: The main configuration file for the CKAN application, defining plugins, database connections, and extension settings.
*   **`ckan-config.yaml`**: Defines the initial set of Organizations, Groups, Packages (Datasets), and Harvesters.
*   **`schema.yaml`**: Defines custom metadata fields for datasets using `ckanext-scheming`.
*   **`Dockerfile`**: Builds the custom CKAN image, installing necessary system libraries (GDAL, GEOS, PROJ) and Python extensions.
*   **`requirements.txt`**: Lists all Python dependencies and CKAN extensions.
*   **`ckan-init.py`**: Handles database initialization, sysadmin creation, and entity synchronization.

## Development & Maintenance

### Link Checking
To manually trigger a link check for all packages:
```bash
ckan check-link check-packages
```

### Metadata Harvesting
Harvesters are defined in `ckan-config.yaml`. To initialize the harvest database:
```bash
ckan -c /srv/app/ckan.ini db upgrade -p harvest
```

### Custom Schemas
Custom fields like `classification`, `source`, and various documentation URLs are defined in `schema.yaml`. Any changes to this file require a restart of the CKAN service to take effect.
