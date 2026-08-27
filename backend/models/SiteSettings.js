import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    siteName: { type: String, default: 'FilatoCo' },
    phone: { type: String, default: '905 5165462' },
    email: { type: String, default: 'mirellascarcelli@gmail.com' },
    instagram: { type: String, default: 'filatoco' },
    facebook: String,
    priceRangeMin: { type: Number, default: 40 },
    priceRangeMax: { type: Number, default: 120 },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
