#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    SELECT 'CREATE DATABASE ckan_default' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ckan_default')\gexec
    SELECT 'CREATE DATABASE datastore_default' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'datastore_default')\gexec
    GRANT ALL PRIVILEGES ON DATABASE ckan_default TO "$POSTGRES_USER";
    GRANT ALL PRIVILEGES ON DATABASE datastore_default TO "$POSTGRES_USER";
EOSQL
