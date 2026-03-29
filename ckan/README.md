# ckan

## Setup ckanext-check-link

https://github.com/DataShades/ckanext-check-link

```bash
docker compose exec ckan ckan db upgrade -p check_link
docker compose exec ckan ckan check-link check-packages
```

Needed a periodic call on one of the ckan replica's to check links for packages and save
