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

# Patch ckan/cli/plugin_info.py to fix inspect.getargspec error on Python 3.10
# (https://github.com/ckan/ckan/pull/7334)
#RUN sed -i 's/args_info = inspect.getargspec(fn)/args_info = inspect.getfullargspec(fn)/g' /srv/app/src/ckan/ckan/cli/plugin_info.py && \
#    sed -i 's/args_info.keywords/args_info.varkw/g' /srv/app/src/ckan/ckan/cli/plugin_info.py

# Return to ckan user (inherited from base image)
USER ckan

# Add automated setup script
COPY --chown=ckan:ckan portal-config.yaml /docker-entrypoint.d/portal-config.yaml
COPY --chown=ckan:ckan setup-portal.py /docker-entrypoint.d/setup-portal.py
RUN chmod +x /docker-entrypoint.d/setup-portal.py

