import fs from 'fs-extra';
import path from 'path';
import { CommitStack } from '../core/stack.js';
import * as logger from '../utils/logger.js';

export const logCommand = async (): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.stackvault')))) {
      throw new Error('Not a StackVault repository (or any of the parent directories)');
    }

    const stack = new CommitStack();
    const commits = await stack.traverse();

    if (commits.length === 0) {
      logger.info('No commits yet');
      return;
    }

    for (const commit of commits) {
      logger.info(`commit ${commit.id}`);
      logger.neutral(`Author: ${commit.author || 'unknown'}`);
      logger.neutral(`Date:   ${commit.timestamp}`);
      logger.neutral(`        ${commit.message}`);
      logger.neutral('---');
    }

  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
