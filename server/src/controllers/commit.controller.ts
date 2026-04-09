import { Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model.js';
import { RepoModel } from '../models/repo.model.js';
import { StackService } from '../services/stack.service.js';
import { BlobService } from '../services/blob.service.js';
import { AuthRequest } from '../types/index.js';

export const CommitController = {
  async push(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username, repo: repoName } = req.params;
      const { commits, blobs } = req.body;
      const authorId = req.user?.id; // from auth middleware

      if (!authorId) return res.status(401).json({ message: 'Unauthorized' });

      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repo = await RepoModel.findByNameAndOwner(repoName as string, user.id);
      if (!repo) return res.status(404).json({ message: 'Repo not found' });
      
      // Ensure push request matches the repo owner
      if (user.id !== authorId) return res.status(403).json({ message: 'Not authorized to push to this repo' });

      // Save Commits
      await StackService.saveCommits(repo.id, authorId, commits);

      // Save Blobs
      await BlobService.saveBlobs(repo.id, blobs);

      return res.status(200).json({ message: `Successfully pushed ${commits?.length || 0} commits` });
    } catch (err) {
      next(err);
    }
  },

  async pull(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username, repo: repoName } = req.params;
      const pathFilter = req.query.path as string | undefined;
      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repo = await RepoModel.findByNameAndOwner(repoName as string, user.id);
      if (!repo) return res.status(404).json({ message: 'Repo not found' });

      const commits = await StackService.getCommitStack(repo.id);
      const headId = commits.length > 0 ? commits[0].id : "null";
      const blobs = headId === "null"
        ? []
        : await BlobService.getBlobsByCommit(headId, pathFilter);

      return res.status(200).json({ commits, blobs, head: headId });
    } catch (err) {
      next(err);
    }
  },

  async getCommits(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username, repo: repoName } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repo = await RepoModel.findByNameAndOwner(repoName as string, user.id);
      if (!repo) return res.status(404).json({ message: 'Repo not found' });

      const result = await StackService.getCommitStackPaginated(repo.id, page, limit);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
};
