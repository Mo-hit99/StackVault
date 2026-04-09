import pkg from 'pg';
const { Pool } = pkg;
import { DATABASE_URL } from './env.js';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to server/.env or the repo root .env file.');
}

const databaseUrl = new URL(DATABASE_URL);
const sslMode = databaseUrl.searchParams.get('sslmode');
const useSsl = sslMode === 'require' || databaseUrl.hostname.endsWith('prisma.io');

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: useSsl
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const checkDatabaseConnection = async () => {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
};
