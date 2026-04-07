import { CommitModel } from '../models/commit.model.js';
import { RepoModel } from '../models/repo.model.js';
import { Commit } from '../types/index.js';

export const StackService = {
  /**
   * Saves commits in parent-first order. 
   * It is assumed `commits` array might be HEAD -> origin, so we reverse it.
   */
  async saveCommits(repoId: number, authorId: number, commits: any[]): Promise<Commit[]> {
    if (!commits || commits.length === 0) return [];
    
    // Sort logic to ensure parent is saved before child.
    // If simple array from CLI is HEAD -> null, we just reverse.
    const orderedCommits = [...commits].reverse();
    
    const saved: Commit[] = [];
    for (const c of orderedCommits) {
      // Check if commit already exists
      const existing = await CommitModel.findById(c.id);
      if (existing) continue;

      const created = await CommitModel.create({
        id: c.id,
        repoId,
        message: c.message,
        parentId: c.parent_id || c.parent, // Handle naming inconsistencies
        authorId,
        timestamp: c.timestamp,
        snapshot: c.snapshot
      });
      saved.push(created);
    }
    return saved;
  },

  async getCommitStack(repoId: number): Promise<Commit[]> {
    return await CommitModel.findByRepoId(repoId);
  }
};
