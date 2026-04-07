CREATE TABLE commits (
  id         VARCHAR(64) PRIMARY KEY,
  repo_id    UUID REFERENCES repos(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  parent_id  VARCHAR(64) REFERENCES commits(id),
  author_id  UUID REFERENCES users(id),
  timestamp  TIMESTAMP NOT NULL,
  snapshot   JSONB NOT NULL
);
