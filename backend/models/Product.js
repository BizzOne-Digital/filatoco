import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  { url: String, publicId: String },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    sku: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: String,
    materials: [String],
    colors: [String],
    dimensions: String,
    stock: { type: Number, default: 1, min: 0 },
    // Style, within the category's craft type (category = Crocheted or Tapestry).
    productType: { type: String, enum: ['shoulder-bag', 'handbag', 'crossbody', 'tote', 'clutch'], required: true },
    madeType: { type: String, enum: ['ready-made', 'custom-made'], default: 'ready-made' },
    images: [imageSchema],
    // Uploaded directly from the browser to Cloudinary (see /api/uploads/video-signature) —
    // routing video through our serverless function would hit Vercel's ~4.5MB body limit.
    video: { type: imageSchema, default: undefined },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    seoTitle: String,
    seoDescription: String,
    // Manual display ranking — lower shows first. Admin-settable "move up/down".
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('validate', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2, 7);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
