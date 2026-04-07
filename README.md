# Gexra

![License](https://img.shields.io/badge/license-MIT-blue.gexrag)

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
npm install -g gexra
```

### Or Install from Source

```bash
git clone https://github.com/anomalyco/gexra.git
cd gexra/cli
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
DATABASE_URL=postgresql://postgres:password@localhost:5432/gexra
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
gexra init

# Stage and commit changes
gexra add .                    # Stage all files
gexra add file.txt             # Stage specific file
gexra add -p src             # Stage only src/ folder
gexra status                 # View staged vs unstaged
gexra commit -m "Initial commit"
gexra commit -m "Update" -p src  # Partial commit (only src/)
gexra log                     # View commit history
```

### Connect to Server
```bash
# Register or login (--url required on first use)
gexra login my@email.com password --url http://localhost:5000

# Set remote (base URL of your server ONLY, not the full path)
gexra remote add origin http://localhost:5000

# Create remote repository (must match your project name)
gexra create-repo my-project -d "My project description"

# Push commits
gexra push origin main
gexra push origin main -p src   # Partial push (only src/)
```

**Note:** The remote URL should be the base server URL (e.g., `http://localhost:5000`), not a full path.

### Clone & Sync
```bash
# Clone existing repo
gexra clone http://localhost:5000/api/repos/otheruser/their-repo
gexra clone http://localhost:5000/api/repos/otheruser/their-repo --path web

# Pull latest changes
gexra pull origin main
gexra pull origin main -p web  # Partial pull (only web/)
```

### Partial Sync (Folders/Files)

Work with specific folders:

```bash
gexra add -p api              # Stage only api/ folder
gexra commit -m "API update" -p api    # Commit only api/ changes
gexra push origin main -p api       # Push only api/ files
gexra pull origin main -p web        # Pull only web/ files
gexra clone https://server/repo --path src  # Clone only src/
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `gexra init` | Initialize a local repository |
| `gexra add [files...]` | Stage file(s) for commit |
| `gexra add -p <path>` | Stage files under path |
| `gexra reset [files...]` | Unstage file(s) |
| `gexra status` | Show working tree status |
| `gexra commit -m "msg"` | Create a commit |
| `gexra commit -m "msg" -p <path>` | Partial commit |
| `gexra log` | Show commit history |
| `gexra register <user> <email> <pass> --url <url>` | Create account |
| `gexra login <email> <pass> --url <url>` | Login to server |
| `gexra create-repo <name> [-d desc] [-p]` | Create repo on server |
| `gexra remote add <name> <url>` | Configure remote server |
| `gexra push [remote] [branch]` | Push commits to remote |
| `gexra push -p <path>` | Partial push |
| `gexra pull [remote] [branch]` | Pull commits from remote |
| `gexra pull -p <path>` | Partial pull |
| `gexra clone <url>` | Clone a repository |
| `gexra clone <url> --path <path>` | Partial clone |

## Project Structure

Each Gexra project contains a `.gexra/` folder that stores:
- Commits history
- File blobs (snapshots)
- Config (remote URL, auth token)
- Staging area

**Warning:** Deleting `.gexra/` folder will lose all local commit history!

## Ignoring Files

Create a `.gexraignore` file to exclude files from versioning:

```
node_modules/
.env
dist/
```

The CLI automatically creates a default `.gexraignore` when you run `gexra init`. The `.gexra/` folder is automatically ignored.

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
2. gexra init
3. gexra add . && gexra commit -m "Initial commit"
4. gexra login email password --url http://localhost:5000
5. gexra remote add origin http://localhost:5000
6. gexra create-repo my-project
7. gexra push
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
- Run `gexra login` first for authenticated commands
- Verify `gexra remote add` points to correct URL
- Check server is accessible

**TypeScript errors on build:**
```bash
cd cli && npm install
npm run build
```
