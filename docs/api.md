# Express Rest APIs

## Auth Routes
- `POST /api/auth/register`: Takes `{ username, email, password }` returns Bearer JWT.
- `POST /api/auth/login`: Authenticates `{ email, password }` returns Bearer JWT.

## Repo Management
- `POST /api/repos/create`: Accepts mapped bodies parsing metadata properties natively.
- `GET /api/repos/:username`: Maps explicit user boundaries yielding active repos safely.
- `GET /api/repos/:username/:repo`: Yields explicit configurations checking HEAD.

## Transfers
- `POST /api/repos/:username/:repo/push`: Accepts `commits` and `blobs` lists.
- `GET /api/repos/:username/:repo/pull`: Exposes tree hierarchies matching isolated nodes securely.
- `GET /api/repos/:username/:repo/clone`: Restores recursive structures tracking queries effectively seamlessly (`?path=src/components...`).
