FROM ckan/ckan-base:2.10

USER root

COPY requirements.txt /srv/app/requirements.txt

RUN apk update && \
    apk add --no-cache \
        geos \
        proj \
        gdal \
        libxml2 \
        libxslt \
        libpq \
        uwsgi-python3 && \
    apk add --no-cache --virtual .build-deps \
        gcc \
        musl-dev \
        postgresql-dev \
        geos-dev \
        proj-dev \
        gdal-dev \
        libxml2-dev \
        libxslt-dev \
        git && \
    pip install --no-cache-dir -r /srv/app/requirements.txt && \
    apk del .build-deps && \
    rm -rf /var/cache/apk/*

RUN chown -R ckan:ckan /srv/app/src/ckan/ckan/public/base/i18n

USER ckan
COPY --chown=ckan:ckan ckan-config.yaml /srv/app/ckan-config.yaml
COPY --chown=ckan:ckan ckan-init.py /srv/app/ckan-init.py
RUN chmod +x /srv/app/ckan-init.py

COPY --chown=ckan:ckan ckan.ini /srv/app/ckan.ini
COPY --chown=ckan:ckan schema.yaml /srv/app/schema.yaml
