import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import { initRepo, writeHead, saveCommit, saveBlob, Commit } from '../core/storage.js';
import * as logger from '../utils/logger.js';

export const cloneCommand = async (url: string, options: { path?: string }): Promise<void> => {
  try {
    const specifiedPath = options.path;
    
    // Parse URL (assume http://server/api/repos/username/repo)
    // Actually, prompt says: "1. Parse url -> extract username, reponame"
    // Let's assume standard format: "http://localhost:5000/api/repos/username/repo"
    
    // Simple basic regex or URL splits
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    // Usually parts: ['api', 'repos', 'username', 'reponame']
    // Fallback logic simply taking the last two
    if (parts.length < 2) throw new Error("Invalid URL format");
    
    const repoName = parts.pop()!;
    const username = parts.pop()!;
    
    let apiUrl = `${urlObj.origin}/api/repos/${username}/${repoName}/clone`;
    if (specifiedPath) {
      apiUrl += `?path=${encodeURIComponent(specifiedPath)}`;
    }

    logger.info(`Cloning into '${repoName}'...`);
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(await res.text());
    
    const { commits, blobs, head } = await res.json() as { commits: Commit[], blobs: any[], head: string };
    
    const targetDir = path.join(process.cwd(), repoName);
    if (await fs.pathExists(targetDir)) {
      throw new Error(`Directory '${repoName}' already exists.`);
    }
    
    await fs.ensureDir(targetDir);
    
    // Switch process.cwd logic for internal storage.js calls temporarily
    process.chdir(targetDir);
    
    // Init repo locally
    await initRepo();
    
    // Write config pointing to origin
    const configPath = path.join('.gexra', 'config');
    await fs.outputJson(configPath, { 
      remote: urlObj.origin, 
      username,
      partialPath: specifiedPath 
    }, { spaces: 2 });
    
    // Save commits
    for (const commit of commits) {
      await saveCommit(commit);
    }
    
    // Save objects implicitly converting blobs
    for (const blob of blobs) {
      const buffer = Buffer.from(blob.content, 'utf8');
      await saveBlob(blob.content_hash, buffer);
      
      // Also restore file into working directory
      await fs.outputFile(blob.filepath, buffer);
    }
    
    await writeHead(head);
    
    if (specifiedPath) {
        logger.info(`(partial: ${specifiedPath})`);
    }
    logger.success(`Cloned ${repoName}`);
    
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
