import fs from 'fs-extra';
import path from 'path';
import { CommitStack } from '../core/stack.js';
import { hashAllFiles, hashFile, diffSnapshot, Snapshot } from '../core/snapshot.js';
import { readConfig, readIndex, writeIndex, saveBlob, IndexEntry } from '../core/storage.js';
import { createHash } from '../utils/hash.js';
import * as logger from '../utils/logger.js';

import { Commit } from '../core/storage.js';

export const commitCommand = async (message: string, pathFilter?: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.gexra')))) {
      throw new Error('Not a Gexra repository (or any of the parent directories)');
    }

    const stack = new CommitStack();
    const parentCommit = await stack.peek();
    const oldSnapshot = parentCommit ? parentCommit.snapshot : {};
    
    const config = await readConfig();
    const partialPath = pathFilter || config.partialPath;
    const index = await readIndex();
    
    let newSnapshot: Snapshot = { ...oldSnapshot };
    
    const stagedEntries = index.filter(e => e.staged);
    
    if (stagedEntries.length === 0) {
      logger.info('No changes to commit (nothing staged).');
      logger.info('Use "gexra add <files>" to stage changes.');
      return;
    }

    const currentSnapshot = await hashAllFiles(cwd);
    
    for (const entry of stagedEntries) {
      const fullPath = path.join(cwd, entry.filepath);
      
      if (await fs.pathExists(fullPath)) {
        const currentHash = await hashFile(fullPath);
        newSnapshot[entry.filepath] = currentHash;
        
        if (!oldSnapshot[entry.filepath] || oldSnapshot[entry.filepath] !== currentHash) {
          const contentBuffer = await fs.readFile(fullPath);
          await saveBlob(currentHash, contentBuffer);
        }
      } else {
        delete newSnapshot[entry.filepath];
      }
    }

    if (partialPath) {
      const mergedSnapshot: Record<string, string> = {};
      for (const key in oldSnapshot) {
        if (!key.startsWith(partialPath)) {
          mergedSnapshot[key] = oldSnapshot[key];
        }
      }
      for (const [filepath, hash] of Object.entries(newSnapshot)) {
        if (filepath.startsWith(partialPath)) {
          mergedSnapshot[filepath] = hash;
        }
      }
      newSnapshot = mergedSnapshot;
      logger.info(`Partial commit: ${partialPath}`);
    }

    const { added, modified, deleted } = diffSnapshot(oldSnapshot, newSnapshot);

    if (added.length === 0 && modified.length === 0 && deleted.length === 0) {
      logger.info('No changes to commit.');
      return;
    }

    const timestamp = new Date().toISOString();
    const parentId = parentCommit ? parentCommit.id : 'null';
    const author = config.username || 'localuser';

    const rawCommitString = parentId + timestamp + message + JSON.stringify(newSnapshot);
    const commitId = createHash(rawCommitString);

    const commit: Commit = {
      id: commitId,
      message,
      timestamp,
      parent: parentId,
      author,
      snapshot: newSnapshot
    };

    await stack.push(commit);
    
    await writeIndex([]);

    logger.success(`Committed: ${commitId.substring(0, 8)} — ${message}`);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
