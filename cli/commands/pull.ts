import fs from 'fs-extra';
import path from 'path';
import { apiGet } from '../core/api.js';
import { saveCommit, writeHead, saveBlob, readConfig, Commit } from '../core/storage.js';
import * as logger from '../utils/logger.js';
import { isProtectedPath } from '../utils/ignore.js';

type RemoteBlob = {
  filepath: string;
  content: string;
  content_hash: string;
};

export const pullCommand = async (remoteName?: string, branch?: string, pathFilter?: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.gexra')))) {
      throw new Error('Not a Gexra repository');
    }

    const config = await readConfig();
    const username = config.username;
    const repoName = config.repo || path.basename(cwd);
    const partialPath = pathFilter || config.partialPath;

    if (!username) {
      throw new Error('Not logged in. Run "gexra login" first.');
    }

    if (!config.remote) {
      throw new Error('No remote configured. Run "gexra remote add origin <url>" first.');
    }

    const encodedUsername = encodeURIComponent(username);
    const encodedRepo = encodeURIComponent(repoName);
    const querySuffix = partialPath ? `?path=${encodeURIComponent(partialPath)}` : '';

    logger.info('Pulling from origin...');
    const response = await apiGet(`/api/repos/${encodedUsername}/${encodedRepo}/pull${querySuffix}`);
    
    const { commits, blobs, head } = response as { commits: Commit[]; blobs?: RemoteBlob[]; head: string };

    for (const commit of commits) {
      await saveCommit(commit);
    }
    await writeHead(head);

    let blobsToRestore: RemoteBlob[] = Array.isArray(blobs) ? blobs : [];

    if (!Array.isArray(blobs)) {
      const topCommit = commits.find(commit => commit.id === head);
      const snapshotEntries = Object.entries(topCommit?.snapshot || {});

      for (const [filepath] of snapshotEntries) {
        if (partialPath && !filepath.startsWith(partialPath)) {
          continue;
        }

        if (isProtectedPath(filepath)) {
          continue;
        }

        try {
          const blob = await apiGet(
            `/api/repos/${encodedUsername}/${encodedRepo}/blob?filepath=${encodeURIComponent(filepath)}`
          ) as RemoteBlob;
          blobsToRestore.push(blob);
        } catch (err: any) {
          logger.info(`Skipping missing remote blob: ${filepath}`);
        }
      }
    }

    for (const blob of blobsToRestore) {
      if (isProtectedPath(blob.filepath)) {
        logger.neutral(`Skipping protected path: ${blob.filepath}`);
        continue;
      }

      const buffer = Buffer.from(blob.content, 'utf8');
      await saveBlob(blob.content_hash, buffer);
      await fs.outputFile(path.join(cwd, blob.filepath), buffer);
    }

    if (partialPath) {
      logger.info(`Partial pull: ${partialPath}`);
    }
    logger.success(`Pulled. HEAD is now ${head.substring(0, 8)}`);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
