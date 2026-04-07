import fs from 'fs-extra';
import path from 'path';
import fetch, { HeadersInit } from 'node-fetch';
import { getToken, getUsername } from '../core/api.js';
import { writeConfig, readConfig } from '../core/storage.js';
import * as logger from '../utils/logger.js';

const authPost = async (baseUrl: string, authPath: string, body: any): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const res = await fetch(`${baseUrl}${authPath}`, {
    method: 'POST',
    headers: headers as HeadersInit,
    body: JSON.stringify(body)
  });
  
  if (!res.ok) throw new Error(await res.text());
  
  return await res.json();
};

const getBaseUrl = async (): Promise<string> => {
  const config = await readConfig();
  if (!config.remote) throw new Error("No remote configured. Run 'gexra remote add origin <url>'");
  return config.remote;
};

const saveAuth = async (cwd: string, username: string, token: string, remoteUrl?: string) => {
  const configPath = path.join(cwd, '.sv', 'config');
  let config: any = {};
  
  if (await fs.pathExists(configPath)) {
    config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  }
  
  config.token = token;
  config.username = username;
  if (remoteUrl) {
    config.remote = remoteUrl;
  }
  
  await fs.ensureDir(path.join(cwd, '.sv'));
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
};

export const loginCommand = async (email: string, password: string, serverUrl?: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    const baseUrl = serverUrl || await getBaseUrl();
    
    logger.info('Logging in...');
    const response: any = await authPost(baseUrl, '/api/auth/login', { email, password });
    
    await saveAuth(cwd, response.user.username, response.token, serverUrl);
    
    logger.success(`Logged in as ${response.user.username}`);
    if (serverUrl) {
      logger.info(`Server: ${serverUrl}`);
    }
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};

export const registerCommand = async (username: string, email: string, password: string, serverUrl?: string): Promise<void> => {
  try {
    const cwd = process.cwd();
    const baseUrl = serverUrl || await getBaseUrl();
    
    logger.info('Registering...');
    const response: any = await authPost(baseUrl, '/api/auth/register', { username, email, password });
    
    await saveAuth(cwd, username, response.token, serverUrl);
    
    logger.success(`Registered and logged in as ${username}`);
    if (serverUrl) {
      logger.info(`Server: ${serverUrl}`);
    }
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};

export const createRepoCommand = async (name: string, description?: string, isPrivate?: boolean): Promise<void> => {
  try {
    const cwd = process.cwd();
    const username = await getUsername();
    
    logger.info(`Creating repository '${name}'...`);
    
    const config = await readConfig();
    const baseUrl = config.remote;
    
    const headers = {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    };

    const res = await fetch(`${baseUrl}/api/repos/create`, {
      method: 'POST',
      headers: headers as HeadersInit,
      body: JSON.stringify({ name, description: description || '', is_private: isPrivate || false })
    });
    
    if (!res.ok) throw new Error(await res.text());
    
    const response: any = await res.json();
    
    // Save repo name to config for push/pull
    config.repo = response.name;
    await fs.writeFile(path.join(cwd, '.gexra', 'config'), JSON.stringify(config, null, 2));
    
    logger.success(`Repository '${response.name}' created successfully!`);
    logger.info(`Remote URL: ${baseUrl}`);
    logger.info(`Run 'gexra push' to push your commits`);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};
