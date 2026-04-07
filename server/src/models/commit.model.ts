import { query } from '../config/db.js';
import { Commit } from '../types/index.js';

export const CommitModel = {
  async create({ id, repoId, message, parentId, authorId, timestamp, snapshot }: { 
    id: string, 
    repoId: number, 
    message: string, 
    parentId?: string | null, 
    authorId: number, 
    timestamp: string | number | Date, 
    snapshot: Record<string, string> 
  }): Promise<Commit> {
    const text = 'INSERT INTO commits(id, repo_id, message, parent_id, author_id, timestamp, snapshot) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const sanitizedParentId = parentId === 'null' ? null : parentId;
    
    let dt = new Date(timestamp);
    if (isNaN(dt.getTime())) {
       dt = new Date();
    }
    
    const values = [id, repoId, message, sanitizedParentId, authorId, dt, JSON.stringify(snapshot)];
    const { rows } = await query(text, values);
    return rows[0];
  },

  async findByRepoId(repoId: number): Promise<Commit[]> {
    const text = `
      SELECT c.*, u.username as author 
      FROM commits c 
      LEFT JOIN users u ON c.author_id = u.id 
      WHERE c.repo_id = $1 
      ORDER BY c.timestamp DESC
    `;
    const { rows } = await query(text, [repoId]);
    return rows;
  },

  async findByRepoIdPaginated(repoId: number, limit: number, offset: number): Promise<Commit[]> {
    const text = `
      SELECT c.*, u.username as author 
      FROM commits c 
      LEFT JOIN users u ON c.author_id = u.id 
      WHERE c.repo_id = $1 
      ORDER BY c.timestamp DESC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await query(text, [repoId, limit, offset]);
    return rows;
  },
  
  async countByRepoId(repoId: number): Promise<number> {
    const text = 'SELECT COUNT(*) as count FROM commits WHERE repo_id = $1';
    const { rows } = await query(text, [repoId]);
    return parseInt(rows[0].count);
  },

  async countByUser(userId: number): Promise<number> {
    const text = 'SELECT COUNT(*) as count FROM commits WHERE author_id = $1';
    const { rows } = await query(text, [userId]);
    return parseInt(rows[0].count);
  },
  
  async findById(id: string): Promise<Commit | undefined> {
    const text = 'SELECT * FROM commits WHERE id = $1';
    const { rows } = await query(text, [id]);
    return rows[0];
  }
};
