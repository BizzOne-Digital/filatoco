import Category from '../models/Category.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

const ALLOWED_CATEGORY_FIELDS = ['name', 'description', 'isActive', 'sortOrder'];

const pickAllowedFields = (body) => {
  const picked = {};
  for (const key of ALLOWED_CATEGORY_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  return picked;
};

export const getCategories = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort('sortOrder name');
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    let image;
    if (req.file) image = await uploadBufferToCloudinary(req.file.buffer, 'filatoco/categories');
    const category = await Category.create({ ...pickAllowedFields(req.body), image });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (req.file) {
      if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
      category.image = await uploadBufferToCloudinary(req.file.buffer, 'filatoco/categories');
    }
    Object.assign(category, pickAllowedFields(req.body));
    await category.save();
    res.json({ category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
