import fs from 'fs-extra';
import path from 'path';
import { apiGet } from '../core/api.js';
import { saveCommit, writeHead, saveBlob, readConfig, Commit } from '../core/storage.js';
import * as logger from '../utils/logger.js';

export const pullCommand = async (remoteName?: string, branch?: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.stackvault')))) {
      throw new Error('Not a StackVault repository');
    }

    const config = await readConfig();
    const username = config.username || 'localuser';
    const repoName = path.basename(cwd);

    logger.info('Pulling from origin...');
    const response = await apiGet(`/api/repos/${username}/${repoName}/pull`);
    
    const { commits, head } = response;

    for (const commit of commits as Commit[]) {
      await saveCommit(commit);
    }
    await writeHead(head);

    // Restore files
    if (commits.length > 0) {
      const topCommit = (commits as Commit[]).find(c => c.id === head);
      if (topCommit && topCommit.snapshot) {
        for (const [filepath, hash] of Object.entries(topCommit.snapshot)) {
          // If partialPath is configured, only restore files that match it
          if (config.partialPath && !filepath.startsWith(config.partialPath)) {
            continue;
          }

          const blobPath = path.join(cwd, '.stackvault', 'objects', `${hash}.blob`);
          if (await fs.pathExists(blobPath)) {
            const buf = await fs.readFile(blobPath);
            await fs.outputFile(path.join(cwd, filepath), buf);
          }
        }
      }
    }

    logger.success(`Pulled. HEAD is now ${head.substring(0, 8)}`);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
