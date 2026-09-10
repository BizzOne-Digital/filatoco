import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getVideoUploadSignature } from '../controllers/uploadController.js';

const router = express.Router();

router.get('/video-signature', protect, adminOnly, getVideoUploadSignature);

export default router;
