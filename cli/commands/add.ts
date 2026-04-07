import fs from 'fs-extra';
import path from 'path';
import { readIndex, writeIndex, IndexEntry } from '../core/storage.js';
import { hashFile } from '../core/snapshot.js';
import { parseIgnore, isIgnored } from '../utils/ignore.js';
import * as logger from '../utils/logger.js';

export const addCommand = async (files: string[], pathFilter?: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.sv')))) {
      throw new Error('Not a StackVault repository (or any of the parent directories)');
    }

    const ignoreRules = await parseIgnore(cwd);
    const index = await readIndex();
    
    if (pathFilter) {
      const targetDir = path.join(cwd, pathFilter);
      if (!(await fs.pathExists(targetDir))) {
        throw new Error(`Path not found: ${pathFilter}`);
      }
      const dirFiles = await getAllFiles(targetDir, cwd, ignoreRules);
      for (const filepath of dirFiles) {
        if (filepath.startsWith(pathFilter)) {
          await stageFile(cwd, filepath, index);
        }
      }
      await writeIndex(index);
      logger.success(`Added ${dirFiles.length} file(s) to staging area (${pathFilter})`);
      return;
    }
    
    if (files.length === 0 || (files.length === 1 && files[0] === '.')) {
      const allFiles = await getAllFiles(cwd, cwd, ignoreRules);
      for (const filepath of allFiles) {
        await stageFile(cwd, filepath, index);
      }
      await writeIndex(index);
      logger.success(`Added ${allFiles.length} file(s) to staging area`);
      return;
    }

    let addedCount = 0;
    for (const file of files) {
      const fullPath = path.join(cwd, file);
      
      if (!(await fs.pathExists(fullPath))) {
        logger.error(`Path not found: ${file}`);
        continue;
      }

      if ((await fs.stat(fullPath)).isDirectory()) {
        const dirFiles = await getAllFiles(fullPath, cwd, ignoreRules);
        for (const filepath of dirFiles) {
          await stageFile(cwd, filepath, index);
          addedCount++;
        }
      } else {
        const relativePath = path.relative(cwd, fullPath).split(path.sep).join('/');
        if (isIgnored(relativePath, ignoreRules)) {
          logger.neutral(`Skipping ignored: ${file}`);
          continue;
        }
        await stageFile(cwd, relativePath, index);
        addedCount++;
      }
    }

    await writeIndex(index);
    
    if (addedCount > 0) {
      logger.success(`Added ${addedCount} file(s) to staging area`);
    } else {
      logger.info('No files added');
    }
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};

async function getAllFiles(dir: string, rootDir: string, ignoreRules: string[]): Promise<string[]> {
  const files: string[] = [];
  
  const traverse = async (currentDir: string): Promise<void> => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(rootDir, fullPath).split(path.sep).join('/');
      
      if (isIgnored(relativePath, ignoreRules)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await traverse(fullPath);
      } else if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  };
  
  await traverse(dir);
  return files;
}

async function stageFile(cwd: string, filepath: string, index: IndexEntry[]): Promise<void> {
  const fullPath = path.join(cwd, filepath);
  const hash = await hashFile(fullPath);
  
  const existingIndex = index.findIndex(e => e.filepath === filepath);
  if (existingIndex >= 0) {
    index[existingIndex] = { filepath, hash, staged: true };
  } else {
    index.push({ filepath, hash, staged: true });
  }
}

export const unstageCommand = async (files: string[]): Promise<void> => {
  try {
    const cwd = process.cwd();
    if (!(await fs.pathExists(path.join(cwd, '.sv')))) {
      throw new Error('Not a StackVault repository (or any of the parent directories)');
    }

    const index = await readIndex();
    
    if (files.length === 0 || (files.length === 1 && files[0] === '.')) {
      for (const entry of index) {
        entry.staged = false;
      }
      logger.success('Unstaged all files');
    } else {
      let removedCount = 0;
      for (const file of files) {
        const idx = index.findIndex(e => e.filepath === file);
        if (idx >= 0) {
          index.splice(idx, 1);
          removedCount++;
        }
      }
      logger.success(`Removed ${removedCount} file(s) from staging`);
    }
    
    await writeIndex(index);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
