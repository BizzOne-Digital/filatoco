import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    image: {
      url: String,
      publicId: String,
    },
    caption: String,
    link: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);
