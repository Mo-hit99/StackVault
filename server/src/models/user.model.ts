import { query } from '../config/db.js';
import { User } from '../types/index.js';

export const UserModel = {
  async create({ username, email, passwordHash }: { username: string, email: string, passwordHash: string }): Promise<User> {
    const text = 'INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING id, username, email, created_at';
    const values = [username, email, passwordHash];
    const { rows } = await query(text, values);
    return rows[0];
  },
  
  async findByEmail(email: string): Promise<User | undefined> {
    const text = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await query(text, [email]);
    return rows[0];
  },

  async findByUsername(username: string): Promise<User | undefined> {
    const text = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await query(text, [username]);
    return rows[0];
  },

  async findById(id: number): Promise<User | undefined> {
    const text = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const { rows } = await query(text, [id]);
    return rows[0];
  }
};
