import Testimonial from '../models/Testimonial.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isPublished: true };
    const testimonials = await Testimonial.find(filter).sort('sortOrder -createdAt');
    res.json({ testimonials });
  } catch (err) {
    next(err);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    let image;
    if (req.file) image = await uploadBufferToCloudinary(req.file.buffer, 'filatoco/testimonials');
    const testimonial = await Testimonial.create({ ...req.body, image });
    res.status(201).json({ testimonial });
  } catch (err) {
    next(err);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Not found' });
    if (req.file) {
      if (testimonial.image?.publicId) await deleteFromCloudinary(testimonial.image.publicId);
      testimonial.image = await uploadBufferToCloudinary(req.file.buffer, 'filatoco/testimonials');
    }
    Object.assign(testimonial, req.body);
    await testimonial.save();
    res.json({ testimonial });
  } catch (err) {
    next(err);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Not found' });
    if (testimonial.image?.publicId) await deleteFromCloudinary(testimonial.image.publicId);
    await testimonial.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
