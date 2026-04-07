import fs from 'fs-extra';
import path from 'path';
import { createHash } from '../utils/hash.js';
import { parseIgnore, isIgnored } from '../utils/ignore.js';

export type Snapshot = Record<string, string>;

/**
 * Gets the hash of a file's content
 */
export const hashFile = async (filepath: string): Promise<string> => {
  const content = await fs.readFile(filepath);
  return createHash(content);
};

/**
 * Iterates through a directory building a map of { file_path: hash }
 */
export const hashAllFiles = async (dir: string): Promise<Snapshot> => {
  const ignoreRules = await parseIgnore(dir);
  const snapshot: Snapshot = {};

  const traverse = async (currentDir: string): Promise<void> => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Calculate relative posix path to match against ignore rules properly
      const relativePath = path.relative(dir, fullPath).split(path.sep).join('/');

      if (isIgnored(relativePath, ignoreRules)) {
        continue;
      }

      if (entry.isDirectory()) {
        await traverse(fullPath);
      } else if (entry.isFile()) {
        snapshot[relativePath] = await hashFile(fullPath);
      }
    }
  };

  await traverse(dir);
  return snapshot;
};

export interface SnapshotDiff {
  added: string[];
  modified: string[];
  deleted: string[];
}

/**
 * Compares two snapshots to find additions, modifications, and deletions.
 * @param {Snapshot} oldSnap - The previous snapshot 
 * @param {Snapshot} newSnap - The current snapshot
 */
export const diffSnapshot = (oldSnap: Snapshot, newSnap: Snapshot): SnapshotDiff => {
  const added: string[] = [];
  const modified: string[] = [];
  const deleted: string[] = [];

  const oldKeys = Object.keys(oldSnap);
  const newKeys = Object.keys(newSnap);

  for (const file of newKeys) {
    if (!oldSnap[file]) {
      added.push(file);
    } else if (oldSnap[file] !== newSnap[file]) {
      modified.push(file);
    }
  }

  for (const file of oldKeys) {
    if (!newSnap[file]) {
      deleted.push(file);
    }
  }

  return { added, modified, deleted };
};
