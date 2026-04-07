import { Router } from 'express';
import { CommitController } from '../controllers/commit.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Endpoint path context mounted in app.js: /api/repos
router.post('/:username/:repo/push', authMiddleware, CommitController.push);
router.get('/:username/:repo/pull', CommitController.pull);
router.get('/:username/:repo/commits', CommitController.getCommits);

export default router;
