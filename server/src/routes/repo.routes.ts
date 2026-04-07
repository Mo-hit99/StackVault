import { Router } from 'express';
import { RepoController } from '../controllers/repo.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// /api/repos/create
router.post('/create', authMiddleware, RepoController.create);

// /api/repos/me/stats
router.get('/me/stats', authMiddleware, RepoController.getStatsMy);

// /api/repos/:username/:repo
router.get('/:username/:repo', RepoController.getDetail);

// /api/repos/:username/stats
router.get('/:username/stats', RepoController.getStats);

// /api/repos/:username (list repos)
router.get('/:username', RepoController.listByUser);

// /api/repos/:username/:repo (update/delete)
router.put('/:username/:repo', authMiddleware, RepoController.update);
router.delete('/:username/:repo', authMiddleware, RepoController.delete);

export default router;
