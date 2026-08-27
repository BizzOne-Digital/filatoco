import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { getSettings, updateSettings, getHomepageContent, updateHomepageContent } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, adminOnly, updateSettings);
router.get('/homepage', getHomepageContent);
router.put(
  '/homepage',
  protect,
  adminOnly,
  upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'aboutImage', maxCount: 1 },
    { name: 'processImage', maxCount: 1 },
  ]),
  updateHomepageContent
);

export default router;
