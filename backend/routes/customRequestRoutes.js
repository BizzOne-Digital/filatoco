import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { submitCustomRequest, getCustomRequests, updateCustomRequestStatus } from '../controllers/customRequestController.js';

const router = express.Router();

router.post('/', upload.single('referenceImage'), submitCustomRequest);
router.get('/', protect, adminOnly, getCustomRequests);
router.put('/:id/status', protect, adminOnly, updateCustomRequestStatus);

export default router;
