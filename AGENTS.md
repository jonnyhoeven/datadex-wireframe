# AI Agent Guidelines for Datadex Wireframe

As an AI agent working on the Datadex Wireframe project, you must adhere strictly to the following instructions:

## Critical Constraints

- **NEVER restart Docker or Docker Compose services.** You are strictly prohibited from restarting Docker or modifying
  the running Docker Compose state (do not run `docker compose up`, `down`, or `restart`). Assume the backend
  infrastructure is managed by the user and is already running.

## Development Workflow

- **Primary References:** Always focus on the root `README.md` and `frontend/README.md` for context on development and
  coding tasks. These files contain essential details regarding the Dockerized CKAN backend, the Next.js frontend, and
  the Infrastructure as Code (IaC) setup.
- **Frontend Tasks:** For frontend development, the local development server should be used. This server is started by
  running `yarn dev` from inside the `frontend/` directory.

## Playwright MCP Integration

- **Browser Automation:** This project is configured with a Playwright MCP (Model Context Protocol) server, allowing you
  to interact with the local development server via browser automation.
- **Usage:** The Playwright MCP should be used in conjunction with the `yarn dev` command. While the development server
  is running (at `http://localhost:3000`), you can utilize Playwright tools to visually test, navigate, and evaluate the
  application.
- **Prerequisites:** If Playwright browsers are missing when attempting to use the MCP, you can install them by running
  `npx playwright install chrome` within the `frontend` directory.