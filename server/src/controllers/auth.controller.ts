import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import { PasswordService } from '../services/password.service.js';
import { User, UserPayload } from '../types/index.js';

const generateToken = (user: { id: number, username: string }) => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any
  });
};

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check existing user
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) return res.status(400).json({ message: 'Username already exists' });

      const passwordHash = await PasswordService.hash(password);
      const user = await UserModel.create({ username, email, passwordHash });

      const token = generateToken(user);
      return res.status(201).json({ token, user });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(401).json({ message: 'Invalid credentials '});

      // User object comes from DB, check password
      const isMatch = await PasswordService.compare(password, user.password_hash);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken({ id: user.id, username: user.username });
      const safeUser = { id: user.id, username: user.username, email: user.email, created_at: user.created_at };

      return res.status(200).json({ token, user: safeUser });
    } catch (err) {
      next(err);
    }
  }
};
