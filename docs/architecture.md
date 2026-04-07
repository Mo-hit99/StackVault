# Data Architecture

## Commit Stack
Commits are tied sequentially using a singly-linked list natively linking downward.
```
HEAD → commit_3 → commit_2 → commit_1 → null
```
Each commit holds metadata (timestamp, author, generic string keys) alongside a `snapshot` JSON structure tracking absolute file hashes resolving to Blob files globally.

## Local Storage (`.stackvault/`)
- `HEAD`: Text tracking pointer generic active ID string.
- `config`: Authentication tokens mapping remote JSON strings.
- `commits/`: Individual node blocks resolving SHA256 hashes cleanly.
- `objects/`: Unpacked file buffers statically served representing point-in-time contents safely.

## Database Constraints
`pg` bindings tightly map external relationships via standard Foreign Keys seamlessly extending remote operations (`commit_id -> rep_id -> owner_id`). Cascading ensures partial deletion handles generic dependencies perfectly.
