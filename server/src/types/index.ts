export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Repo {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  is_private: boolean;
  created_at: Date;
}

export interface Commit {
  id: string;
  repo_id: number;
  message: string;
  author: string;
  timestamp: Date;
  parent_id: string | null;
  snapshot: Record<string, string>;
}

export interface Blob {
  id: number;
  commit_id: string;
  repo_id: number;
  filepath: string;
  content: string;
  content_hash: string;
  size: number;
  created_at: Date;
}

export interface UserPayload {
  id: number;
  username: string;
}

import { Request } from 'express';
export interface AuthRequest extends Request {
  user?: UserPayload;
}

