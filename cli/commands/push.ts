import fs from 'fs-extra';
import path from 'path';
import { CommitStack } from '../core/stack.js';
import { loadBlob, readConfig } from '../core/storage.js';
import { apiPost } from '../core/api.js';
import * as logger from '../utils/logger.js';

export const pushCommand = async (remoteName?: string, branch?: string, pathFilter?: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.gexra')))) {
      throw new Error('Not a Gexra repository');
    }

    const stack = new CommitStack();
    const commits = await stack.traverse();
    
    if (commits.length === 0) {
      logger.info('No commits to push');
      return;
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

    logger.info(`Config remote: ${config.remote}`);
    logger.info('Preparing payload...');
    const blobs: any[] = [];
    const blobSet = new Set<string>();
    
    for (const commit of commits) {
      for (const [filepath, hash] of Object.entries(commit.snapshot)) {
        if (partialPath && !filepath.startsWith(partialPath)) {
          continue;
        }
        if (!blobSet.has(hash)) {
          blobSet.add(hash);
          const contentBuffer = await loadBlob(hash);
          blobs.push({
            filepath,
            content: contentBuffer.toString('utf8'),
            content_hash: hash,
            commit_id: commit.id
          });
        }
      }
    }

    if (partialPath) {
      logger.info(`Partial push: ${partialPath}`);
    }

    const payload = { commits, blobs };
    const encodedUsername = encodeURIComponent(username);
    const encodedRepo = encodeURIComponent(repoName);
    const fullUrl = `${config.remote}/api/repos/${encodedUsername}/${encodedRepo}/push`;
    
    logger.info(`Pushing to ${encodedUsername}/${encodedRepo}...`);
    logger.info('Pushing to server...');
    
    const headers = {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    };

    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: headers as HeadersInit,
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error(await res.text());
    
    logger.success(`Pushed ${commits.length} commits to ${username}/${repoName}`);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
