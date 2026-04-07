import fs from 'fs-extra';
import path from 'path';
import { CommitStack } from '../core/stack.js';
import { loadBlob, readConfig } from '../core/storage.js';
import { apiPost } from '../core/api.js';
import * as logger from '../utils/logger.js';

export const pushCommand = async (remoteName?: string, branch?: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.stackvault')))) {
      throw new Error('Not a StackVault repository');
    }

    const stack = new CommitStack();
    const commits = await stack.traverse(); // Returns commits from HEAD to null
    
    if (commits.length === 0) {
      logger.info('No commits to push');
      return;
    }

    const config = await readConfig();
    const username = config.username || 'localuser';
    const repoName = path.basename(cwd);

    logger.info('Preparing payload...');
    const blobs: any[] = [];
    const blobSet = new Set<string>();
    
    // Gather all blobs referenced in all commits
    for (const commit of commits) {
      for (const [filepath, hash] of Object.entries(commit.snapshot)) {
        if (!blobSet.has(hash)) {
          blobSet.add(hash);
          const contentBuffer = await loadBlob(hash);
          blobs.push({
            filepath,
            content: contentBuffer.toString('utf8'), // convert to string
            content_hash: hash,
            commit_id: commit.id
          });
        }
      }
    }

    const payload = { commits, blobs };
    
    logger.info('Pushing to server...');
    await apiPost(`/api/repos/${username}/${repoName}/push`, payload);
    
    logger.success(`Pushed ${commits.length} commits to origin`);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
