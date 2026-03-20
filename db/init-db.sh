#!/bin/bash
set -e

# Define the user for the main CKAN database and datastore write operations
CKAN_APP_USER="${POSTGRES_USER:-ckan_default}"
CKAN_APP_PASSWORD="${POSTGRES_PASSWORD:-password}"

# Define the user for the CKAN Datastore read-only operations
# The error indicates CKAN expects a user named 'datastore_default' for the datastore read-only access.
DATASTORE_READONLY_USER="datastore_default"
DATASTORE_READONLY_PASSWORD="${POSTGRES_PASSWORD:-password}" # Using the same password for simplicity, can be changed.

# Create users and databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    -- Create the CKAN application user if it doesn't exist
    DO
    \$do\$
    BEGIN
       IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$CKAN_APP_USER') THEN
          CREATE USER "$CKAN_APP_USER" WITH PASSWORD '$CKAN_APP_PASSWORD';
       END IF;
    END
    \$do\$;

    -- Create the datastore read-only user if it doesn't exist
    DO
    \$do\$
    BEGIN
       IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DATASTORE_READONLY_USER') THEN
          CREATE USER "$DATASTORE_READONLY_USER" WITH PASSWORD '$DATASTORE_READONLY_PASSWORD';
       END IF;
    END
    \$do\$;

    -- Create the main CKAN database
    DROP DATABASE IF EXISTS "ckan_default";
    CREATE DATABASE "ckan_default" OWNER "$POSTGRES_USER"; -- Owner can be POSTGRES_USER or CKAN_APP_USER
    GRANT ALL PRIVILEGES ON DATABASE "ckan_default" TO "$POSTGRES_USER";
    GRANT CONNECT ON DATABASE "ckan_default" TO "$CKAN_APP_USER";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "ckan_default" <<-EOSQL
    GRANT USAGE ON SCHEMA public TO "$CKAN_APP_USER";
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO "$CKAN_APP_USER";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO "$CKAN_APP_USER";
EOSQL

# Create the Datastore database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    DROP DATABASE IF EXISTS "datastore_default";
    -- According to CKAN docs, datastore_default database should be owned by ckan_default user
    CREATE DATABASE "datastore_default" OWNER "$CKAN_APP_USER";
    GRANT ALL PRIVILEGES ON DATABASE "datastore_default" TO "$POSTGRES_USER";
    GRANT CONNECT ON DATABASE "datastore_default" TO "$CKAN_APP_USER";
    GRANT CONNECT ON DATABASE "datastore_default" TO "$DATASTORE_READONLY_USER";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "datastore_default" <<-EOSQL
    -- Permissions for the CKAN application user (write access to datastore)
    GRANT USAGE ON SCHEMA public TO "$CKAN_APP_USER";
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "$CKAN_APP_USER";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "$CKAN_APP_USER";
    GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO "$CKAN_APP_USER";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO "$CKAN_APP_USER";

    -- Permissions for the datastore read-only user
    GRANT USAGE ON SCHEMA public TO "$DATASTORE_READONLY_USER";
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO "$DATASTORE_READONLY_USER";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO "$DATASTORE_READONLY_USER";
EOSQL
