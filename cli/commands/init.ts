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
    const defaultIgnorePath = path.join(__dirname, '../../.svignore.default');
    const targetIgnorePath = path.join(process.cwd(), '.svignore');
    
    if (await fs.pathExists(defaultIgnorePath) && !(await fs.pathExists(targetIgnorePath))) {
      await fs.copy(defaultIgnorePath, targetIgnorePath);
    }

    logger.success('Initialized empty StackVault repo');
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
