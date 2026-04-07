import { Router } from 'express';
import { RepoController } from '../controllers/repo.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// /api/repos/create
router.post('/create', authMiddleware, RepoController.create);

// /api/repos/:username
router.get('/:username', RepoController.listByUser);

// /api/repos/:username/:repo
router.get('/:username/:repo', RepoController.getDetail);

export default router;
