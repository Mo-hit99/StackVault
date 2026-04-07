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

  async findByOwnerPaginated(ownerId: number, limit: number, offset: number) {
    const text = 'SELECT * FROM repos WHERE owner_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
    const countText = 'SELECT COUNT(*) as count FROM repos WHERE owner_id = $1';
    
    const { rows } = await query(text, [ownerId, limit, offset]);
    const { rows: countRows } = await query(countText, [ownerId]);
    const total = parseInt(countRows[0].count);
    
    return {
      repos: rows,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      }
    };
  },

  async findByNameAndOwner(name: string, ownerId: number): Promise<Repo | undefined> {
    const text = 'SELECT * FROM repos WHERE name = $1 AND owner_id = $2';
    const { rows } = await query(text, [name, ownerId]);
    return rows[0];
  },

  async update(id: number, { name, description, isPrivate }: { name?: string, description?: string, isPrivate?: boolean }): Promise<Repo> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (isPrivate !== undefined) {
      fields.push(`is_private = $${paramIndex++}`);
      values.push(isPrivate);
    }

    if (fields.length === 0) {
      const { rows } = await query('SELECT * FROM repos WHERE id = $1', [id]);
      return rows[0];
    }

    values.push(id);
    const text = `UPDATE repos SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const { rows } = await query(text, values);
    return rows[0];
  },

  async delete(id: number): Promise<void> {
    await query('DELETE FROM repos WHERE id = $1', [id]);
  }
};
