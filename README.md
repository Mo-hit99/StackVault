# StackVault
![NPM Version](https://img.shields.io/npm/v/stackvault.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

StackVault is a mini version control system inspired by Git. This repo contains three apps that work together:

- `cli`: the local developer tool that creates commits from files in a working directory
- `server`: the Express + PostgreSQL API that stores users, repositories, commits, and blobs
- `web`: the React + Vite UI for authentication and repository browsing

## Repo Structure

```text
.
|- cli/        # Local command-line tool
|- server/     # REST API + migrations
|- web/        # Frontend app
|- docs/       # Extra notes and internal docs
`- docker-compose.yml
```

## How The Pieces Work Together

### 1. CLI

The CLI is offline-first for local repository operations such as:

- `sv init`
- `sv status`
- `sv commit -m "message"`
- `sv log`

When you want to sync local data to a remote backend, the CLI stores a remote URL inside the local `.stackvault` config and calls the API.

Typical CLI flow:

1. Initialize a StackVault repository locally.
2. Create commits from local file snapshots.
3. Configure a remote API URL with `sv remote add origin <url>`.
4. Push and pull commit data through the backend.

### 2. Server

The server exposes API routes under `/api` and uses PostgreSQL for persistence.

Main route groups:

- `/api/auth`
- `/api/repos`
- `/api/repos/:username/:repo/push`
- `/api/repos/:username/:repo/pull`
- `/api/repos/:username/:repo/commits`
- `/api/repos/:username/:repo/clone`
- `/api/repos/:username/:repo/blob`

The server is the bridge between the CLI, the web app, and the database.

### 3. Web

The web app talks to the same backend API used by the CLI.

It uses:

- `VITE_API_URL` for the backend base URL
- auth endpoints for login and registration
- repo and commit endpoints for data display

In local development, the normal setup is:

- `web` running on Vite
- `server` running on port `5000`
- PostgreSQL running locally or in Docker

## Prerequisites

Install these first:

- Node.js 20+ or newer
- npm
- PostgreSQL

Optional:

- Docker Desktop, if you want to run Postgres with Docker instead of a local installation

## Step 1: Install Dependencies

Install dependencies in each app:

```bash
cd server && npm install
cd ../cli && npm install
cd ../web && npm install
```

## Step 2: Configure Environment Files

### Server env

Create `server/.env` from `server/.env.example`.

Example:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/stackvault
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

Notes:

- `DATABASE_URL` must point to the database your server should use
- the server reads `server/.env` first

### Web env

Create `web/.env` from `web/.env.example`.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Start PostgreSQL

You can use either local Postgres or Docker.

### Option A: Local PostgreSQL

1. Create a database named `stackvault`.
2. Update `server/.env` with the correct username, password, host, port, and database name.

Example connection string:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/stackvault
```

### Option B: Docker Compose

Start the bundled services from the repo root:

```bash
docker-compose up
```

The included compose file starts:

- Postgres
- the server container

If you use Docker Compose for Postgres, make sure your local `server/.env` matches the database you actually want to use when running the server outside Docker.

## Step 4: Run Database Migrations

The SQL files in `server/migrations` do not run automatically on their own. Run:

```bash
cd server
npm run migrate
```

This will:

- enable `pgcrypto` if needed
- create a `schema_migrations` table
- apply all `.sql` files in `server/migrations`

Expected tables:

- `users`
- `repos`
- `commits`
- `blobs`
- `schema_migrations`

## Step 5: Start The Server

```bash
cd server
npm run dev
```

Expected startup logs:

```text
Database connected successfully
StackVault Server listening on port 5000
```

If startup fails:

- check `server/.env`
- make sure Postgres is running
- make sure the database exists
- make sure migrations were applied
- make sure port `5000` is free

## Step 6: Start The Web App

```bash
cd web
npm run dev
```

The frontend will call:

```text
http://localhost:5000/api
```

unless you override it in `web/.env`.

## Step 7: Build Or Run The CLI

Build the CLI:

```bash
cd cli
npm run build
```

Run the built CLI:

```bash
node dist/bin/sv.js --help
```

Example local workflow:

```bash
mkdir my-repo
cd my-repo
sv init
sv status
sv commit -m "Initial commit"
sv log
```

## Connecting The CLI To The Server

The CLI stores a single remote URL in its local StackVault config.

Example:

```bash
sv remote add origin http://localhost:5000
```

Then the CLI can use:

- `sv push`
- `sv pull`
- `sv clone <url>`

Important:

- the remote URL should be the backend server base URL
- the CLI builds the API route internally using the configured username and local repository name
- some CLI API calls expect authentication to be present in local config

## Typical Local Development Order

When starting fresh, use this order:

1. Start PostgreSQL.
2. Create or verify `server/.env`.
3. Run `cd server && npm run migrate`.
4. Run `cd server && npm run dev`.
5. Run `cd web && npm run dev`.
6. Run `cd cli && npm run build`.
7. Test CLI and web flows against the running backend.

## API Summary

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Repos:

- `POST /api/repos/create`
- `GET /api/repos/:username`
- `GET /api/repos/:username/:repo`

Commits:

- `POST /api/repos/:username/:repo/push`
- `GET /api/repos/:username/:repo/pull`
- `GET /api/repos/:username/:repo/commits`

Blobs:

- `GET /api/repos/:username/:repo/clone`
- `GET /api/repos/:username/:repo/blob`

## Troubleshooting

### Server cannot connect to Postgres

Check:

- Postgres is running
- `DATABASE_URL` is correct
- the target database exists
- the configured port is correct

### Tables do not exist

Run:

```bash
cd server
npm run migrate
```

### Server says port 5000 is already in use

Either:

- stop the process already using port `5000`
- or change `PORT` in `server/.env`

### Web cannot reach backend

Check:

- server is running
- `VITE_API_URL` matches the backend URL
- browser is calling the expected host and port

### CLI push or pull fails

Check:

- remote is configured
- server is running
- the remote URL is correct
- auth/token data exists if the command requires it

## Useful Commands

### Server

```bash
npm run dev
npm run build
npm run migrate
```

### CLI

```bash
npm run build
npm run watch
npm run start
```

### Web

```bash
npm run dev
npm run build
npm run preview
```

## Notes For Developers

- The server uses SQL migration files in `server/migrations`.
- The migration runner tracks applied files in `schema_migrations`.
- The web and CLI both depend on the backend API being reachable.
- If you change route shapes in the server, update both `web` and `cli` integrations.

See `docs/` for deeper internal notes and implementation details.
