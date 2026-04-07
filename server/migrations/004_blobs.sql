CREATE TABLE blobs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_id    VARCHAR(64) REFERENCES commits(id) ON DELETE CASCADE,
  repo_id      UUID REFERENCES repos(id) ON DELETE CASCADE,
  filepath     TEXT NOT NULL,
  content      TEXT NOT NULL,
  content_hash VARCHAR(64) NOT NULL,
  size         INTEGER,
  created_at   TIMESTAMP DEFAULT NOW()
);
