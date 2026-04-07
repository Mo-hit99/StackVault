import { Response, NextFunction } from 'express';
import { RepoModel } from '../models/repo.model.js';
import { UserModel } from '../models/user.model.js';
import { CommitModel } from '../models/commit.model.js';
import { AuthRequest } from '../types/index.js';

export const RepoController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, description, is_private } = req.body;
      const ownerId = req.user?.id; // From authMiddleware

      if (!ownerId) return res.status(401).json({ message: 'Unauthorized' });
      if (!name) return res.status(400).json({ message: 'Repository name required' });

      const existing = await RepoModel.findByNameAndOwner(name, ownerId);
      if (existing) return res.status(400).json({ message: 'Repository with this name already exists' });

      const repo = await RepoModel.create({ name, description, ownerId, isPrivate: is_private });
      return res.status(201).json(repo);
    } catch (err) {
      next(err);
    }
  },

  async listByUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const offset = (page - 1) * limit;
      const result = await RepoModel.findByOwnerPaginated(user.id, limit, offset);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getDetail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username, repo: repoName } = req.params;
      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repo = await RepoModel.findByNameAndOwner(repoName as string, user.id);
      if (!repo) return res.status(404).json({ message: 'Repo not found' });

      // Find head pointer (latest commit id)
      const commits = await CommitModel.findByRepoId(repo.id);
      const headId = commits.length > 0 ? commits[0].id : null;

      return res.status(200).json({ ...repo, head: headId });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username, repo: repoName } = req.params;
      const { name, description, is_private } = req.body;
      const ownerId = req.user?.id;

      if (!ownerId) return res.status(401).json({ message: 'Unauthorized' });

      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repo = await RepoModel.findByNameAndOwner(repoName as string, user.id);
      if (!repo) return res.status(404).json({ message: 'Repo not found' });

      if (user.id !== ownerId) return res.status(403).json({ message: 'Not authorized' });

      const updated = await RepoModel.update(repo.id, { name, description, isPrivate: is_private });
      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username, repo: repoName } = req.params;
      const ownerId = req.user?.id;

      if (!ownerId) return res.status(401).json({ message: 'Unauthorized' });

      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repo = await RepoModel.findByNameAndOwner(repoName as string, user.id);
      if (!repo) return res.status(404).json({ message: 'Repo not found' });

      if (user.id !== ownerId) return res.status(403).json({ message: 'Not authorized' });

      await RepoModel.delete(repo.id);
      return res.status(200).json({ message: 'Repository deleted' });
    } catch (err) {
      next(err);
    }
  },

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repos = await RepoModel.findByOwner(user.id);
      const totalCommits = await CommitModel.countByUser(user.id);
      const activeProjects = repos.filter(r => r.is_private === false).length;

      return res.status(200).json({
        repos: repos.length,
        commits: totalCommits,
        activeProjects
      });
    } catch (err) {
      next(err);
    }
  },

  async getStatsMy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const repos = await RepoModel.findByOwner(userId);
      const totalCommits = await CommitModel.countByUser(userId);
      const activeProjects = repos.filter(r => r.is_private === false).length;

      return res.status(200).json({
        repos: repos.length,
        commits: totalCommits,
        activeProjects
      });
    } catch (err) {
      next(err);
    }
  }
};
