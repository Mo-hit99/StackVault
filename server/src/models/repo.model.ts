import { query } from '../config/db.js';
import { Repo } from '../types/index.js';

export const RepoModel = {
  async create({ name, description, ownerId, isPrivate = false }: { name: string, description?: string, ownerId: number, isPrivate?: boolean }): Promise<Repo> {
    const text = 'INSERT INTO repos(name, description, owner_id, is_private) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [name, description, ownerId, isPrivate];
    const { rows } = await query(text, values);
    return rows[0];
  },

  async findByOwner(ownerId: number): Promise<Repo[]> {
    const text = 'SELECT * FROM repos WHERE owner_id = $1 ORDER BY created_at DESC';
    const { rows } = await query(text, [ownerId]);
    return rows;
  },

  async findByNameAndOwner(name: string, ownerId: number): Promise<Repo | undefined> {
    const text = 'SELECT * FROM repos WHERE name = $1 AND owner_id = $2';
    const { rows } = await query(text, [name, ownerId]);
    return rows[0];
  }
};
