FROM ckan/ckan-base:2.10

# Install dependencies for ckanext-spatial and ckanext-harvest
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

# Install extensions from requirements.txt
COPY requirements.txt /srv/app/requirements.txt
RUN pip install --no-cache-dir -r /srv/app/requirements.txt
RUN chown -R ckan:ckan /srv/app/src/ckan/ckan/public/base/i18n

# Return to ckan user (inherited from base image)
USER ckan

# Add automated setup script
COPY --chown=ckan:ckan docker-entrypoint.d/setup-portal.py /docker-entrypoint.d/setup-portal.py
RUN chmod +x /docker-entrypoint.d/setup-portal.py
