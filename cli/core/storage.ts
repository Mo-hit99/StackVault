import fs from 'fs-extra';
import path from 'path';

const SV_DIR = '.stackvault';
const SV_COMMITS_DIR = path.join(SV_DIR, 'commits');
const SV_OBJECTS_DIR = path.join(SV_DIR, 'objects');
const SV_HEAD = path.join(SV_DIR, 'HEAD');
const SV_CONFIG = path.join(SV_DIR, 'config');

export interface Commit {
  id: string;
  message: string;
  author: string;
  parent: string | null;
  timestamp: string | number;
  snapshot: Record<string, string>;
}

export interface Config {
  remote?: string;
  token?: string;
  username?: string;
  partialPath?: string;
  user?: {
    name: string;
    email: string;
  };
}

/**
 * Ensures repo doesn't already exist and builds structure
 */
export const initRepo = async (): Promise<void> => {
  if (await fs.pathExists(SV_DIR)) {
    throw new Error('StackVault repository already exists.');
  }

  await fs.ensureDir(SV_COMMITS_DIR);
  await fs.ensureDir(SV_OBJECTS_DIR);
  
  await writeHead('null');
  await writeConfig({});
};

/**
 * Returns current commit id or "null"
 */
export const readHead = async (): Promise<string | null> => {
  if (!(await fs.pathExists(SV_HEAD))) return null;
  const head = await fs.readFile(SV_HEAD, 'utf8');
  return head.trim();
};

/**
 * Updates HEAD
 */
export const writeHead = async (id: string): Promise<void> => {
  await fs.writeFile(SV_HEAD, id, 'utf8');
};

/**
 * Read the local config JSON object
 */
export const readConfig = async (): Promise<Config> => {
  if (!(await fs.pathExists(SV_CONFIG))) return {};
  const data = await fs.readFile(SV_CONFIG, 'utf8');
  return JSON.parse(data);
};

/**
 * Writes data into the config JSON
 */
export const writeConfig = async (data: Config): Promise<void> => {
  await fs.writeFile(SV_CONFIG, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * Writes commit JSON
 */
export const saveCommit = async (commit: Commit): Promise<void> => {
  const commitPath = path.join(SV_COMMITS_DIR, `${commit.id}.json`);
  await fs.writeFile(commitPath, JSON.stringify(commit, null, 2), 'utf8');
};

/**
 * Reads commit JSON
 */
export const loadCommit = async (id: string): Promise<Commit> => {
  const commitPath = path.join(SV_COMMITS_DIR, `${id}.json`);
  if (!(await fs.pathExists(commitPath))) {
    throw new Error(`Commit ${id} not found locally.`);
  }
  const data = await fs.readFile(commitPath, 'utf8');
  return JSON.parse(data);
};

/**
 * Stores file blob
 */
export const saveBlob = async (hash: string, contentBuffer: Buffer | string): Promise<void> => {
  const blobPath = path.join(SV_OBJECTS_DIR, `${hash}.blob`);
  await fs.writeFile(blobPath, contentBuffer);
};

/**
 * Reads file blob buffer
 */
export const loadBlob = async (hash: string): Promise<Buffer> => {
  const blobPath = path.join(SV_OBJECTS_DIR, `${hash}.blob`);
  if (!(await fs.pathExists(blobPath))) {
    throw new Error(`Blob ${hash} not found locally.`);
  }
  return await fs.readFile(blobPath);
};
