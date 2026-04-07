import fetch, { HeadersInit } from 'node-fetch';
import { readConfig, writeConfig } from './storage.js';

export const getBaseUrl = async (): Promise<string> => {
  const config = await readConfig();
  if (!config.remote) throw new Error("No remote configured. Run 'sv remote add origin <url>'");
  return config.remote;
};

export const getToken = async (): Promise<string> => {
  const config = await readConfig();
  if (!config.token) throw new Error("Not authenticated. Please run 'sv login' first.");
  return config.token;
};

export const getUsername = async (): Promise<string> => {
  const config = await readConfig();
  if (!config.username) throw new Error("Not authenticated. Please run 'sv login' first.");
  return config.username;
};

export const apiGet = async (path: string): Promise<any> => {
  const baseUrl = await getBaseUrl();
  const token = await getToken().catch(() => null);

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, { headers: headers as HeadersInit });
  if (!res.ok) throw new Error(await res.text());
  
  return await res.json();
};

export const apiPost = async (path: string, body: any): Promise<any> => {
  const baseUrl = await getBaseUrl();
  const token = await getToken();

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: headers as HeadersInit,
    body: JSON.stringify(body)
  });
  
  if (!res.ok) throw new Error(await res.text());
  
  return await res.json();
};

export const authPost = async (path: string, body: any): Promise<any> => {
  const baseUrl = await getBaseUrl();

  const headers = {
    'Content-Type': 'application/json'
  };

  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: headers as HeadersInit,
    body: JSON.stringify(body)
  });
  
  if (!res.ok) throw new Error(await res.text());
  
  return await res.json();
};
