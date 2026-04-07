import { Router } from 'express';
import { BlobController } from '../controllers/blob.controller.js';

const router = Router();

// Mounted similarly on /api/repos
router.get('/:username/:repo/clone', BlobController.clone);
router.get('/:username/:repo/blob', BlobController.getFileBlob);

export default router;
