import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model.js';
import { RepoModel } from '../models/repo.model.js';
import { StackService } from '../services/stack.service.js';
import { BlobService } from '../services/blob.service.js';

export const BlobController = {
  async clone(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, repo: repoName } = req.params;
      const pathFilter = req.query.path as string | undefined; // partial clone filter 'src/components'

      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repo = await RepoModel.findByNameAndOwner(repoName as string, user.id);
      if (!repo) return res.status(404).json({ message: 'Repo not found' });

      // Get entire commit stack
      const commits = await StackService.getCommitStack(repo.id);
      const headId = commits.length > 0 ? commits[0].id : "null";

      if (headId === "null") {
        return res.status(200).json({ commits: [], blobs: [], head: "null" });
      }

      // We only return the blobs of the LATEST commit (HEAD) for cloning the working directory.
      const blobs = await BlobService.getBlobsByCommit(headId, pathFilter);

      return res.status(200).json({ commits, blobs, head: headId });
    } catch (err) {
      next(err);
    }
  },

  async getFileBlob(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, repo: repoName } = req.params;
      const filepath = req.query.filepath as string | undefined;

      if (!filepath) return res.status(400).json({ message: 'filepath query required' });

      const user = await UserModel.findByUsername(username as string);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const repo = await RepoModel.findByNameAndOwner(repoName as string, user.id);
      if (!repo) return res.status(404).json({ message: 'Repo not found' });

      // Find head commit for finding latest version of file
      const commits = await StackService.getCommitStack(repo.id);
      if (commits.length === 0) return res.status(404).json({ message: 'No commits in this repo' });

      const headId = commits[0].id;
      // Get all blobs for HEAD commit and find exact filepath
      const blobs = await BlobService.getBlobsByCommit(headId);
      const fileBlob = blobs.find(b => b.filepath === filepath);

      if (!fileBlob) return res.status(404).json({ message: 'File not found in HEAD snapshot' });

      return res.status(200).json(fileBlob);
    } catch (err) {
      next(err);
    }
  }
};
