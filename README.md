# Gexra

![License](https://img.shields.io/badge/license-MIT-blue.svg)

Gexra is a modern version control system. Manage your code locally with the CLI, sync to a remote server, and browse repositories through a beautiful web interface.

## Features

- **Offline-first CLI** - Work locally without a server, sync when ready
- **Staging Area** - Stage specific files before committing
- **Remote Sync** - Push/pull commits to a central server
- **Modern Web UI** - Browse repos, view commits, and explore code files
- **JWT Authentication** - Secure token-based auth for user accounts
- **File Snapshots** - SHA256 hashes track file changes
- **.gexraignore Support** - Exclude files from versioning

## Architecture

```
gexra/
├── cli/        # Command-line tool (gexra)
├── server/     # Express API + PostgreSQL
├── web/        # React + Vite frontend
└── docker-compose.yml
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| CLI | TypeScript + Commander.js |
| Server | Express + TypeScript |
| Database | PostgreSQL |
| Frontend | React + Vite + Tailwind CSS |
| Auth | JWT |

## Quick Start

### Install CLI Globally from npm

```bash
npm install -g stackvault
```

### Or Install from Source

```bash
git clone https://github.com/anomalyco/stackvault.git
cd stackvault/cli
npm install
npm run build
npm link
```

### 1. Install Backend Dependencies

```bash
cd server && npm install
cd ../cli && npm install
cd ../web && npm install
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/stackvault
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```

**Web** (`web/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Services

```bash
# Start PostgreSQL (Docker)
docker-compose up -d postgres

# Run migrations
cd server && npm run migrate

# Start backend
cd server && npm run dev

# Start frontend (new terminal)
cd web && npm run dev

# Build and link CLI
cd cli && npm run build && npm link
```

## CLI Usage

### Local Workflow
```bash
# Initialize repository
mkdir my-project && cd my-project
sv init

# Stage and commit changes
sv add .                    # Stage all files
sv add file.txt             # Stage specific file
sv add -p src             # Stage only src/ folder
sv status                 # View staged vs unstaged
sv commit -m "Initial commit"
sv commit -m "Update" -p src  # Partial commit (only src/)
sv log                     # View commit history
```

### Connect to Server
```bash
# Register or login (--url required on first use)
sv login my@email.com password --url http://localhost:5000

# Set remote (base URL of your server ONLY, not the full path)
sv remote add origin http://localhost:5000

# Create remote repository (must match your project name)
sv create-repo my-project -d "My project description"

# Push commits
sv push origin main
sv push origin main -p src   # Partial push (only src/)
```

**Note:** The remote URL should be the base server URL (e.g., `http://localhost:5000`), not a full path.

### Clone & Sync
```bash
# Clone existing repo
sv clone http://localhost:5000/api/repos/otheruser/their-repo
sv clone http://localhost:5000/api/repos/otheruser/their-repo --path web

# Pull latest changes
sv pull origin main
sv pull origin main -p web  # Partial pull (only web/)
```

### Partial Sync (Folders/Files)

Work with specific folders:

```bash
sv add -p api              # Stage only api/ folder
sv commit -m "API update" -p api    # Commit only api/ changes
sv push origin main -p api       # Push only api/ files
sv pull origin main -p web        # Pull only web/ files
sv clone https://server/repo --path src  # Clone only src/
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `sv init` | Initialize a local repository |
| `sv add [files...]` | Stage file(s) for commit |
| `sv add -p <path>` | Stage files under path |
| `sv reset [files...]` | Unstage file(s) |
| `sv status` | Show working tree status |
| `sv commit -m "msg"` | Create a commit |
| `sv commit -m "msg" -p <path>` | Partial commit |
| `sv log` | Show commit history |
| `sv register <user> <email> <pass> --url <url>` | Create account |
| `sv login <email> <pass> --url <url>` | Login to server |
| `sv create-repo <name> [-d desc] [-p]` | Create repo on server |
| `sv remote add <name> <url>` | Configure remote server |
| `sv push [remote] [branch]` | Push commits to remote |
| `sv push -p <path>` | Partial push |
| `sv pull [remote] [branch]` | Pull commits from remote |
| `sv pull -p <path>` | Partial pull |
| `sv clone <url>` | Clone a repository |
| `sv clone <url> --path <path>` | Partial clone |

## Project Structure

Each Gexra project contains a `.sv/` folder that stores:
- Commits history
- File blobs (snapshots)
- Config (remote URL, auth token)
- Staging area

**Warning:** Deleting `.sv/` folder will lose all local commit history!

## Ignoring Files

Create a `.svignore` file to exclude files from versioning:

```
node_modules/
.env
dist/
```

The CLI automatically creates a default `.svignore` when you run `sv init`. The `.sv/` folder is automatically ignored.

## Web Interface

The web app runs at `http://localhost:5173`:

- User registration and login
- Dashboard with repository listing
- Create new repositories with modal
- Repository browser with file tree
- Commit history viewer
- Code file viewer

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Repositories
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/repos/create` | Create new repository |
| GET | `/api/repos/:username` | List user's repositories |
| GET | `/api/repos/:username/:repo` | Get repository details |

### Commits
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/repos/:username/:repo/push` | Push commits to server |
| GET | `/api/repos/:username/:repo/pull` | Pull commit history |
| GET | `/api/repos/:username/:repo/commits` | List commits |

### Blobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/repos/:username/:repo/clone` | Clone full repository |
| GET | `/api/repos/:username/:repo/blob` | Get file content |

## Database Schema

- **users** - User accounts with hashed passwords
- **repos** - Repository metadata (name, owner, visibility)
- **commits** - Commit history with parent links
- **blobs** - File snapshots with content hashes
- **schema_migrations** - Migration tracking

## Typical Workflow

```
1. mkdir project && cd project
2. sv init
3. sv add . && sv commit -m "Initial commit"
4. sv login email password --url http://localhost:5000
5. sv remote add origin http://localhost:5000
6. sv create-repo my-project
7. sv push
8. Open http://localhost:5173 to view your repo
```

## Troubleshooting

**Server can't connect to database:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `server/.env`
- Ensure database exists

**Web can't reach backend:**
- Verify server is running on port 5000
- Check `VITE_API_URL` in web `.env`

**CLI push/pull fails:**
- Run `sv login` first for authenticated commands
- Verify `sv remote add` points to correct URL
- Check server is accessible

**TypeScript errors on build:**
```bash
cd cli && npm install
npm run build
```
