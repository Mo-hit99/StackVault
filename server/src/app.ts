import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes.js';
import repoRoutes from './routes/repo.routes.js';
import commitRoutes from './routes/commit.routes.js';
import blobRoutes from './routes/blob.routes.js';

import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
// Increase payload limit because blobs/commits payload can be large
app.use(express.json({ limit: '50mb' }));

// Mount Endpoints
app.use('/api/auth', authRoutes);

// Repos + Commits + Blobs all mounted on top of /api/repos
app.use('/api/repos', repoRoutes);
app.use('/api/repos', commitRoutes);
app.use('/api/repos', blobRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.json({ message: 'StackVault Server Running' });
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
