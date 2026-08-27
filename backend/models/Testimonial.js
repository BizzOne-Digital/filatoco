import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: {
      url: String,
      publicId: String,
    },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
