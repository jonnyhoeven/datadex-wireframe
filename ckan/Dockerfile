FROM ckan/ckan-base:2.10

USER root
RUN apk update && \
    apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    geos-dev \
    proj-dev \
    gdal-dev \
    libxml2-dev \
    libxslt-dev \
    git \
    uwsgi-python3

COPY requirements.txt /srv/app/requirements.txt
RUN pip install --no-cache-dir -r /srv/app/requirements.txt
RUN chown -R ckan:ckan /srv/app/src/ckan/ckan/public/base/i18n

USER ckan
COPY --chown=ckan:ckan ckan-init.py /srv/app/ckan-init.py
RUN chmod +x /srv/app/ckan-init.py
COPY --chown=ckan:ckan ckan-config.yaml /srv/app/ckan-config.yaml
COPY --chown=ckan:ckan schema.yaml /srv/app/schema.yaml
