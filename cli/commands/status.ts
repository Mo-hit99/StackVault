import fs from 'fs-extra';
import path from 'path';
import { CommitStack } from '../core/stack.js';
import { hashAllFiles, diffSnapshot } from '../core/snapshot.js';
import * as logger from '../utils/logger.js';

export const statusCommand = async (): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.stackvault')))) {
      throw new Error('Not a StackVault repository (or any of the parent directories)');
    }

    const stack = new CommitStack();
    const parentCommit = await stack.peek();
    const oldSnapshot = parentCommit ? parentCommit.snapshot : {};
    
    const newSnapshot = await hashAllFiles(cwd);
    const { added, modified, deleted } = diffSnapshot(oldSnapshot, newSnapshot);

    if (added.length === 0 && modified.length === 0 && deleted.length === 0) {
      logger.success('Working directory clean');
      return;
    }

    if (modified.length > 0) {
      logger.header('Modified:');
      modified.forEach(f => logger.neutral(`  ${f}`));
    }
    
    if (added.length > 0) {
      console.log('\x1b[32mAdded:\x1b[0m');
      added.forEach(f => logger.neutral(`  ${f}`));
    }
    
    if (deleted.length > 0) {
      console.log('\x1b[31mDeleted:\x1b[0m');
      deleted.forEach(f => logger.neutral(`  ${f}`));
    }

  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
