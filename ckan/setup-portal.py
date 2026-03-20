import yaml
import requests
import os
import sys
import time
import subprocess

CKAN_URL = os.environ.get('CKAN_SITE_URL', 'http://localhost:5000').rstrip('/')
CKAN_INI = os.environ.get('CKAN_INI', '/srv/app/ckan.ini')
CONFIG_FILE = os.environ.get('CONFIG_FILE', '/docker-entrypoint.d/portal-config.yaml')
CKAN_SYSADMIN_NAME = os.environ.get('CKAN_SYSADMIN_NAME', 'admin')
CKAN_SYSADMIN_EMAIL = os.environ.get('CKAN_SYSADMIN_EMAIL', 'admin@example.com')
CKAN_SYSADMIN_PASSWORD = os.environ.get('CKAN_SYSADMIN_PASSWORD', 'password')
API_KEY = None

try:
    cmd = ["ckan", "-c", CKAN_INI, "sysadmin", "add", CKAN_SYSADMIN_NAME, "email=" + CKAN_SYSADMIN_EMAIL,
           "password=" + CKAN_SYSADMIN_PASSWORD]
    result = subprocess.run(cmd, capture_output=True, text=True, input="y")
    if result.returncode == 0:
        print("Successfully created SYSADMIN.")
    else:
        print(f"Failed to generate SYSADMIN: {result.stderr}")
except Exception as e:
    print(f"Error generating SYSADMIN token: {e}")

try:
    cmd = ["ckan", "-c", CKAN_INI, "user", "token", "add", CKAN_SYSADMIN_NAME, "setup"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        API_KEY = result.stdout.split(":", 1)[1].strip()
        print("Successfully generated API token.")
    else:
        print(f"Failed to generate API token: {result.stderr}")
except Exception as e:
    print(f"Error generating API token: {e}")

try:
    print("Initializing harvest database...")
    cmd = ["ckan", "-c", CKAN_INI, "db", "upgrade", "-p", "harvest"]
    subprocess.run(cmd, capture_output=True, text=True, check=True)
    print("Harvest database initialized.")
except Exception as e:
    print(f"Error initializing harvest database: {e}")

if not API_KEY:
    print("Error: Failed to generate API token, exiting.")
    sys.exit(1)

def wait_for_ckan():
    print(f"Waiting for CKAN at {CKAN_URL}...")
    for _ in range(40):
        try:
            response = requests.get(f"{CKAN_URL}/api/3/action/status_show")
            if response.status_code == 200:
                print("CKAN is up and running!")
                return True
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(2)
    print("CKAN is not responding. Exiting.")
    return False


def call_action(action, data):
    headers = {'Authorization': API_KEY}
    url = f"{CKAN_URL}/api/3/action/{action}"
    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code != 200:
            print(f"Error calling {action}: {response.status_code} {response.text}")
        else:
            print(response.json())
        return response.json()
    except Exception as e:
        print(str(e))
        return {'success': False, 'error': {'message': str(e)}}


def setup_entities(config):
    # Setup Organizations
    for org in config.get('organizations', []):
        print(f"Checking organization: {org['name']}")
        res = call_action('organization_show', {'id': org['name']})
        if not res['success']:
            print(f"Creating organization: {org['name']}")
            call_action('organization_create', org)
        else:
            print(f"Organization {org['name']} already exists.")

    # Setup Groups
    for group in config.get('groups', []):
        print(f"Checking group: {group['name']}")
        res = call_action('group_show', {'id': group['name']})
        if not res['success']:
            print(f"Creating group: {group['name']}")
            call_action('group_create', group)
        else:
            print(f"Group {group['name']} already exists.")

    # Setup Datasets
    for dataset in config.get('datasets', []):
        print(f"Checking dataset: {dataset['name']}")
        res = call_action('package_show', {'id': dataset['name']})
        if not res['success']:
            print(f"Creating dataset: {dataset['name']}")
            # CKAN expects groups as a list of dictionaries with name or id
            dataset_to_create = dataset.copy()
            if 'groups' in dataset_to_create:
                dataset_to_create['groups'] = [{'name': g['name']} if isinstance(g, dict) else {'name': g} for g in dataset_to_create['groups']]
            call_action('package_create', dataset_to_create)
        else:
            print(f"Dataset {dataset['name']} already exists.")

    # Setup Harvesters
    for harvester in config.get('harvesters', []):
        print(f"Checking harvester: {harvester['name']}")
        # Harvesters are usually checked by name/id using harvest_source_show
        res = call_action('harvest_source_show', {'id': harvester['name']})
        if not res['success']:
            print(f"Creating harvester: {harvester['name']}")
            # Map harvester config to match harvest_source_create expectations
            harvest_data = {
                'name': harvester['name'],
                'url': harvester['url'],
                'source_type': harvester['type'],
                'title': harvester.get('title', harvester['name']),
                'notes': harvester.get('description', ''),
                'frequency': harvester.get('frequency', 'MANUAL'),
                'owner_org': harvester.get('owner_org'),
                'active': True
            }

            # If owner_org is missing, try to use the first organization from config
            if not harvest_data['owner_org'] and config.get('organizations'):
                harvest_data['owner_org'] = config['organizations'][0]['name']

            call_action('harvest_source_create', harvest_data)
        else:
            print(f"Harvester {harvester['name']} already exists.")


if __name__ == "__main__":
    if not os.path.exists(CONFIG_FILE):
        print(f"Config file {CONFIG_FILE} not found. Skipping setup.")
        sys.exit(0)

    try:
        pid = os.fork()
        if pid > 0:
            print(f"Forked background process (PID: {pid}) for CKAN setup. Continuing container startup...")
            sys.exit(0)
    except OSError as e:
        print(f"Fork failed: {e}")
        sys.exit(1)

    sys.stdout = open('/tmp/setup-portal.log', 'a')
    sys.stderr = sys.stdout

    with open(CONFIG_FILE, 'r') as f:
        config_data = yaml.safe_load(f)

    if wait_for_ckan():
        setup_entities(config_data)
        print("Setup completed.")
    else:
        print("Setup failed because CKAN did not respond.")
