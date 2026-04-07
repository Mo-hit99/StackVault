# Gexra CLI

A modern version control system with CLI. Built for the cloud.

## Main Features

### 🔹 Add & Stage

Stage files with partial path:

```bash
gexra add .                    # Stage all files
gexra add file.ts src/         # Stage specific files/folders
gexra add -p src              # Stage only src/ folder
gexra status                  # View staged vs unstaged
gexra reset file.ts            # Unstage a file
```

### 🔹 Commit

Create commits with optional path filter:

```bash
gexra commit -m "Add login"       # Full commit
gexra commit -m "Update" -p src  # Partial commit (only src/)
```

### 🔹 Push & Pull

Sync with remote, optionally partial:

```bash
gexra push origin main            # Full push
gexra push origin main -p src    # Partial push (only src/)
gexra pull origin main           # Full pull
gexra pull origin main -p src    # Partial pull (only src/)
```

### 🔹 Clone

Clone with partial path:

```bash
gexra clone https://your-server.com/api/repos/user/repo
gexra clone https://your-server.com/api/repos/user/repo --path src
```

### 🔹 Full Examples

```bash
# Clone only frontend
gexra clone https://server.com/api/repos/user/repo --path web

# Work on API only  
gexra add -p api
gexra commit -m "Update API" -p api
gexra push origin main -p api

# Pull only web changes
gexra pull origin main -p web
```

### 🔹 Remote Configuration

Connect to your server:

```bash
gexra remote add origin https://your-server.com
```

### 🔹 Authentication

Login to access private repositories:

```bash
gexra register username email password --url https://your-server.com
gexra login email password --url https://your-server.com
```

## Installation

### From npm (Published Package)

```bash
npm install -g gexra
gexra --help
```

Or build locally:

```bash
git clone https://github.com/anomalyco/stackvault.git
cd stackvault/cli
npm install
npm run build
npm link
```

Now run `gexra` anywhere:

```bash
gexra init
gexra add .
gexra commit -m "Initial commit"
```

### From Source

```bash
git clone https://github.com/anomalyco/stackvault.git
cd stackvault/cli
npm install
npm run build
npm link
```

Now run `gexra` anywhere:

```bash
gexra init
gexra add .
gexra commit -m "Initial commit"
```

## Quick Start

```bash
# 1. Initialize repository
gexra init

# 2. Add files
gexra add .

# 3. Commit
gexra commit -m "Initial commit"

# 4. Connect to server
gexra remote add origin https://your-server.com
gexra login your@email.com password --url https://your-server.com

# 5. Push
gexra push origin main
```

## All Commands

| Command | Description |
|---------|-------------|
| `gexra init` | Initialize repository |
| `gexra add [files]` | Stage files |
| `gexra reset [files]` | Unstage files |
| `gexra status` | Show working tree status |
| `gexra commit -m "msg"` | Create commit |
| `gexra log` | View commit history |
| `gexra remote add <name> <url>` | Add remote |
| `gexra push [remote] [branch]` | Push to remote |
| `gexra pull [remote] [branch]` | Pull from remote |
| `gexra clone <url>` | Clone repository |
| `gexra login <email> <pass>` | Login |
| `gexra register <user> <email> <pass>` | Register |

## Options

```bash
gexra add --help
gexra commit --help
gexra clone --path src --help   # Partial clone
```

## Server URL Configuration

When deploying to Vercel:

```bash
gexra remote add origin https://your-app.vercel.app
```

For local development:

```bash
gexra remote add origin http://localhost:5000
```

**Note:** Use the base URL only (no `/api` path).

## Development

```bash
cd cli
npm install
npm run build    # Build TypeScript
npm start       # Run CLI
```

## License

MIT