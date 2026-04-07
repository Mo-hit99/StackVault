CREATE TABLE repos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  is_private  BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(owner_id, name)
);
