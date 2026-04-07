# StackVault CLI

A modern version control system with CLI and web interface. Inspired by Git, built for the cloud.

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
sv remote add origin https://your-server.com
```

### 🔹 Authentication

Login to access private repositories:

```bash
sv register username email password --url https://your-server.com
sv login email password --url https://your-server.com
```

## Installation

### From npm (Published Package)

```bash
npm install -g stackvault
sv --help
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
sv init

# 2. Add files
sv add .

# 3. Commit
sv commit -m "Initial commit"

# 4. Connect to server
sv remote add origin https://your-server.com
sv login your@email.com password --url https://your-server.com

# 5. Push
sv push origin main
```

## All Commands

| Command | Description |
|---------|-------------|
| `sv init` | Initialize repository |
| `sv add [files]` | Stage files |
| `sv reset [files]` | Unstage files |
| `sv status` | Show working tree status |
| `sv commit -m "msg"` | Create commit |
| `sv log` | View commit history |
| `sv remote add <name> <url>` | Add remote |
| `sv push [remote] [branch]` | Push to remote |
| `sv pull [remote] [branch]` | Pull from remote |
| `sv clone <url>` | Clone repository |
| `sv login <email> <pass>` | Login |
| `sv register <user> <email> <pass>` | Register |

## Options

```bash
sv add --help
sv commit --help
sv clone --path src --help   # Partial clone
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