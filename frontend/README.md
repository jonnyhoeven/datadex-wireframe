# Frontend

This is the frontend component of the Datadex Wireframe project, built with [Next.js](https://nextjs.org/).

## Prerequisites

- [Node.js](https://nodejs.org/) (Version 24 recommended)
- [nvm](https://github.com/nvm-sh/nvm) (optional, to manage Node.js versions)
- [Yarn](https://yarnpkg.com/) (recommended) or NPM

## Getting Started

### 1. Set Up Node.js Version

If you use `nvm`, run the following in the `frontend` directory:

```bash
nvm install
nvm use
```

This will use the version specified in `.nvmrc`.

### 2. Install Dependencies

In the `frontend` directory, run:

```bash
npm install --global yarn
yarn install
```

### 3. Run the Development Server

Start the development server with:

```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 4. Build for Production

To create an optimized production build:

```bash
yarn build
```

Then start the production server:

```bash
yarn start
```

## Running with Docker

You can also run the entire stack (including the backend) using Docker Compose from the project root:

```bash
docker-compose up --build
```

The frontend will be accessible at [http://localhost:3000](http://localhost:3000).

## Environment Variables

The frontend expects to communicate with a CKAN backend. When running locally outside of Docker, you may need to set environment variables such as:

- `CKAN_BASE_URL`: The URL of the CKAN backend (default: `http://localhost:4000`)
- `NEXT_PUBLIC_CKAN_URL`: The public-facing URL of CKAN for browser-side links (default: `http://localhost:4000`)

## Project Structure

- `pages/`: Contains the Next.js pages (e.g., `index.tsx`, `dataset.tsx`).
- `public/`: Static assets like images and fonts.
- `Dockerfile`: Configuration for building the frontend container image.

## Junie MCP Setup

To allow the Junie AI agent to interact with the local development server via browser automation, configure the Playwright MCP server:

1. In IntelliJ, open the Junie chat and type `/mcp` (or create `.junie/mcp/mcp.json` in the project root).
2. Add the following configuration:

install playwright chrome
```bash
npx playwright install chrome
```
