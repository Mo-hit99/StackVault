# Gexra CLI

A modern version control system with CLI and web interface. Built for the cloud.

## Main Features

### 🔹 Add & Stage

Stage files with partial path:

```bash
sv add .                    # Stage all files
sv add file.ts src/         # Stage specific files/folders
sv add -p src              # Stage only src/ folder
sv status                  # View staged vs unstaged
sv reset file.ts            # Unstage a file
```

### 🔹 Commit

Create commits with optional path filter:

```bash
sv commit -m "Add login"       # Full commit
sv commit -m "Update" -p src  # Partial commit (only src/)
```

### 🔹 Push & Pull

Sync with remote, optionally partial:

```bash
sv push origin main            # Full push
sv push origin main -p src    # Partial push (only src/)
sv pull origin main           # Full pull
sv pull origin main -p src    # Partial pull (only src/)
```

### 🔹 Clone

Clone with partial path:

```bash
sv clone https://your-server.com/api/repos/user/repo
sv clone https://your-server.com/api/repos/user/repo --path src
```

### 🔹 Full Examples

```bash
# Clone only frontend
sv clone https://server.com/api/repos/user/repo --path web

# Work on API only  
sv add -p api
sv commit -m "Update API" -p api
sv push origin main -p api

# Pull only web changes
sv pull origin main -p web
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

Now run `sv` anywhere:

```bash
sv init
sv add .
sv commit -m "Initial commit"
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
sv remote add origin https://your-app.vercel.app
```

For local development:

```bash
sv remote add origin http://localhost:5000
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