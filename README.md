# StackVault
![NPM Version](https://img.shields.io/npm/v/stackvault.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

An open-source mini version control system inspired by Git, built as a learning and portfolio project. It features a complete offline CLI, an Express/PostgreSQL backend, and a modern React/Vite web interface.

## Quick Start

### Global CLI Installation
```bash
npm install -g stackvault
```

### Local Repository Setup
```bash
mkdir my-repo && cd my-repo
sv init
echo "Hello World" > test.txt
sv status
sv commit -m "Initial commit"
sv log
```

## Architecture
StackVault is split into three main components:
1. **cli**: Offline-first terminal binary handling recursive hashing and diff mappings natively.
2. **server**: REST endpoints mounted on Express securely backing up repositories. 
3. **web**: A beautiful GitHub-like React + Tailwind dashboard tracking analytics.

See the `docs/` folder for deeper information regarding the Internal APIs and Data Structures.

## Development

Boot the database and local REST API:
```bash
docker-compose up
```

Boot the frontend:
```bash
cd web && npm run dev
```
