import { readConfig, writeConfig } from '../core/storage.js';
import * as logger from '../utils/logger.js';
import fs from 'fs-extra';
import path from 'path';

export const remoteCommand = async (name: string, url: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.gexra')))) {
      throw new Error('Not a Gexra repository');
    }

    const config = await readConfig();
    
    // For this simple version, assume "origin" mapped to "remote" field directly
    // Overwriting the single `remote` field with the URL.
    config.remote = url;
    
    await writeConfig(config);
    logger.success(`Remote '${name}' set to ${url}`);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
