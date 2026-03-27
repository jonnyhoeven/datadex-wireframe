# AI Agent Guidelines for Datadex Wireframe

As an AI agent working on the Datadex Wireframe project, you must adhere strictly to the following instructions:

## Critical Constraints

- **NEVER restart Docker or Docker Compose services.** You are strictly prohibited from restarting Docker or modifying
  the running Docker Compose state (do not run `docker compose up`, `down`, or `restart`). Assume the backend
  infrastructure is managed by the user and is already running.
- If you edit `ckan-config.yaml` make sure you run `docker compose exec ckan python3 /srv/app/ckan-init.py` to update the ckan api state

## Development Workflow

- **Primary References:** Always focus on the root `README.md` and `frontend/README.md` for context on development and
  coding tasks. These files contain essential details regarding the Dockerized CKAN backend, the Next.js frontend, and
  the Infrastructure as Code (IaC) setup.
- **Frontend Tasks:** For frontend development, the local development server should be used. This server is started by
  running `yarn dev` from inside the `frontend/` directory.
- **ckan data harvest** reload the harvester data from the eu daya provider if the user asks for it.
  ```bash
  ckan --config=/srv/app/ckan.ini harvester gather-consumer
  ckan --config=/srv/app/ckan.ini harvester fetch-consumer
  ckan --config=/srv/app/ckan.ini harvester run
  ```

## Playwright MCP Integration

- **Browser Automation:** This project is configured with a Playwright MCP (Model Context Protocol) server, allowing you
  to interact with the local development server via browser automation.
- **Usage:** The Playwright MCP should be used in conjunction with the `yarn dev` command within the `frontend/` 
  directory. While the development server is running (at `http://localhost:3000`), you can use Playwright to interact 
  test, navigate, and evaluate the application.
- **Prerequisites:** If Playwright browsers are missing when attempting to use the MCP, you can install them by running
  `npx playwright install chrome` within the `frontend` directory.