import Gallery from '../models/Gallery.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

export const getGallery = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const items = await Gallery.find(filter).sort('sortOrder -createdAt');
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image required' });
    const image = await uploadBufferToCloudinary(req.file.buffer, 'filatoco/gallery');
    const item = await Gallery.create({ ...req.body, image });
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId);
    await item.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
