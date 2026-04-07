import fs from 'fs-extra';
import path from 'path';
import { CommitStack } from '../core/stack.js';
import { hashAllFiles, diffSnapshot } from '../core/snapshot.js';
import { readConfig, saveBlob } from '../core/storage.js';
import { createHash } from '../utils/hash.js';
import * as logger from '../utils/logger.js';

import { Commit } from '../core/storage.js';

export const commitCommand = async (message: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    // Check if repo exists
    if (!(await fs.pathExists(path.join(cwd, '.stackvault')))) {
      throw new Error('Not a StackVault repository (or any of the parent directories)');
    }

    const stack = new CommitStack();
    const parentCommit = await stack.peek();
    const oldSnapshot = parentCommit ? parentCommit.snapshot : {};
    
    const config = await readConfig();
    const partialPath = config.partialPath;
    
    let newSnapshot = await hashAllFiles(cwd);
    
    // If it's a partial clone, merge the new state with the parent state
    if (partialPath && parentCommit) {
        const mergedSnapshot: Record<string, string> = { ...parentCommit.snapshot };
        
        // 1. Remove all entries from parent that matched the partialPath (they might be deleted now)
        for (const key in mergedSnapshot) {
            if (key.startsWith(partialPath)) {
                delete mergedSnapshot[key];
            }
        }
        
        // 2. Add all current files from the partialPath
        for (const [filepath, hash] of Object.entries(newSnapshot)) {
            if (filepath.startsWith(partialPath)) {
                mergedSnapshot[filepath] = hash;
            }
        }
        
        newSnapshot = mergedSnapshot;
    }

    const { added, modified, deleted } = diffSnapshot(oldSnapshot, newSnapshot);

    if (added.length === 0 && modified.length === 0 && deleted.length === 0) {
      logger.info('No changes to commit.');
      return;
    }

    // Save blobs for new/modified files
    const changedFiles = [...added, ...modified];
    for (const filepath of changedFiles) {
      const fullPath = path.join(cwd, filepath);
      const contentBuffer = await fs.readFile(fullPath);
      const hash = newSnapshot[filepath];
      await saveBlob(hash, contentBuffer);
    }

    // Compute commit properties
    const timestamp = new Date().toISOString();
    const parentId = parentCommit ? parentCommit.id : 'null';
    
    // Config values (e.g. author pseudo-mock)
    const author = config.username || 'localuser';

    // Commit hash formula:
    // SHA256( parent_id + timestamp + message + JSON.stringify(snapshot) )
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

    // Save to stack
    await stack.push(commit);
    logger.success(`Committed: ${commitId.substring(0, 8)} — ${message}`);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
