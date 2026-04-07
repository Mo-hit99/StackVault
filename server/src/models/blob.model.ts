import { query } from '../config/db.js';
import { Blob } from '../types/index.js';

export const BlobModel = {
  async create({ commitId, repoId, filepath, content, contentHash, size }: {
    commitId: string;
    repoId: number;
    filepath: string;
    content: string;
    contentHash: string;
    size: number;
  }): Promise<Blob> {
    const text = 'INSERT INTO blobs(commit_id, repo_id, filepath, content, content_hash, size) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [commitId, repoId, filepath, content, contentHash, size];
    const { rows } = await query(text, values);
    return rows[0];
  },

  async findByCommitId(commitId: string): Promise<Blob[]> {
    const text = 'SELECT * FROM blobs WHERE commit_id = $1';
    const { rows } = await query(text, [commitId]);
    return rows;
  },

  async findByCommitIdAndPathPrefix(commitId: string, pathPrefix: string): Promise<Blob[]> {
    // Allows pulling blobs where filepath LIKE 'src/components%'
    const text = 'SELECT * FROM blobs WHERE commit_id = $1 AND filepath LIKE $2';
    const prefix = pathPrefix + '%';
    const { rows } = await query(text, [commitId, prefix]);
    return rows;
  }
};
