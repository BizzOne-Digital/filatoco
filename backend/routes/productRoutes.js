import express from 'express';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  duplicateProduct,
  reorderProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', optionalAuth, getProducts);

router.post('/', protect, adminOnly, upload.array('images', 8), createProduct);
// Must be registered before "/:id" — otherwise Express would match "reorder" as an :id.
router.put('/reorder', protect, adminOnly, reorderProducts);
router.put('/:id', protect, adminOnly, upload.array('images', 8), updateProduct);

router.get('/:slug', optionalAuth, getProductBySlug);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.delete('/:id/images/:publicId', protect, adminOnly, deleteProductImage);
router.post('/:id/duplicate', protect, adminOnly, duplicateProduct);

export default router;
