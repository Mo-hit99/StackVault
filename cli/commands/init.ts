import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { initRepo, writeConfig, readConfig } from '../core/storage.js';
import * as logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initCommand = async (): Promise<void> => {
  try {
    await initRepo();
    
    // Copy default ignore to current directory
    const defaultIgnorePath = path.join(__dirname, '../../.gexraignore.default');
    const targetIgnorePath = path.join(process.cwd(), '.gexraignore');
    
    if (await fs.pathExists(defaultIgnorePath) && !(await fs.pathExists(targetIgnorePath))) {
      await fs.copy(defaultIgnorePath, targetIgnorePath);
    }

    logger.success('Initialized empty Gexra repo');
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
