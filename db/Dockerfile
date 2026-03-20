FROM postgres:12-alpine

COPY --chown=postgres:postgres init-db.sh /docker-entrypoint.d/init-db.sh
RUN chmod +x /docker-entrypoint.d/init-db.sh
