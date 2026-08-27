import mongoose from 'mongoose';

const homepageContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'homepage', unique: true },
    heroHeading: { type: String, default: 'Handmade Purses That Tell a Story' },
    heroSubtext: {
      type: String,
      default:
        'Thoughtfully handcrafted crochet, tapestry and sewn bags created with passion, individuality and timeless craftsmanship.',
    },
    heroImage: { url: String, publicId: String },
    aboutHeading: { type: String, default: 'A Passion Woven from Peace & Purpose' },
    aboutText: String,
    aboutImage: { url: String, publicId: String },
    processImage: { url: String, publicId: String },
  },
  { timestamps: true }
);

export default mongoose.model('HomepageContent', homepageContentSchema);
