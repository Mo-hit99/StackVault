import fs from 'fs-extra';
import path from 'path';
import { CommitStack } from '../core/stack.js';
import { hashAllFiles, diffSnapshot, Snapshot } from '../core/snapshot.js';
import { readIndex, IndexEntry, readConfig } from '../core/storage.js';
import * as logger from '../utils/logger.js';

export const statusCommand = async (): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.sv')))) {
      throw new Error('Not a StackVault repository (or any of the parent directories)');
    }

    const stack = new CommitStack();
    const parentCommit = await stack.peek();
    const oldSnapshot = parentCommit ? parentCommit.snapshot : {};
    
    const newSnapshot = await hashAllFiles(cwd);
    const { added, modified, deleted } = diffSnapshot(oldSnapshot, newSnapshot);
    
    const index = await readIndex();
    const config = await readConfig();
    const partialPath = config.partialPath;

    const stagedFiles = new Set<string>();
    for (const entry of index) {
      if (entry.staged) {
        stagedFiles.add(entry.filepath);
      }
    }

    const stagedAdded: string[] = [];
    const stagedModified: string[] = [];
    const unstagedAdded: string[] = [];
    const unstagedModified: string[] = [];

    for (const f of added) {
      if (stagedFiles.has(f)) {
        stagedAdded.push(f);
      } else {
        unstagedAdded.push(f);
      }
    }

    for (const f of modified) {
      const indexEntry = index.find(e => e.filepath === f);
      if (indexEntry && indexEntry.staged && indexEntry.hash === newSnapshot[f]) {
        stagedModified.push(f);
      } else {
        unstagedModified.push(f);
      }
    }

    const unstagedDeleted: string[] = [];
    const stagedDeleted: string[] = [];
    
    for (const f of deleted) {
      if (stagedFiles.has(f)) {
        stagedDeleted.push(f);
      } else {
        unstagedDeleted.push(f);
      }
    }

    const hasStaged = stagedAdded.length > 0 || stagedModified.length > 0 || stagedDeleted.length > 0;
    const hasUnstaged = unstagedAdded.length > 0 || unstagedModified.length > 0 || unstagedDeleted.length > 0;

    if (!hasStaged && !hasUnstaged) {
      logger.success('Working directory clean');
      return;
    }

    if (hasStaged) {
      logger.header('Changes to be committed:');
      
      if (stagedAdded.length > 0) {
        console.log('\x1b[32m  Added:\x1b[0m');
        stagedAdded.forEach(f => logger.neutral(`    ${f}`));
      }
      if (stagedModified.length > 0) {
        console.log('\x1b[33m  Modified:\x1b[0m');
        stagedModified.forEach(f => logger.neutral(`    ${f}`));
      }
      if (stagedDeleted.length > 0) {
        console.log('\x1b[31m  Deleted:\x1b[0m');
        stagedDeleted.forEach(f => logger.neutral(`    ${f}`));
      }
      console.log('');
    }

    if (hasUnstaged) {
      logger.header('Changes not staged for commit:');
      
      if (unstagedModified.length > 0) {
        console.log('\x1b[33m  Modified:\x1b[0m');
        unstagedModified.forEach(f => logger.neutral(`    ${f}`));
      }
      if (unstagedAdded.length > 0) {
        console.log('\x1b[32m  Added:\x1b[0m');
        unstagedAdded.forEach(f => logger.neutral(`    ${f}`));
      }
      if (unstagedDeleted.length > 0) {
        console.log('\x1b[31m  Deleted:\x1b[0m');
        unstagedDeleted.forEach(f => logger.neutral(`    ${f}`));
      }
    }

  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
