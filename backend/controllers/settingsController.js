import SiteSettings from '../models/SiteSettings.js';
import HomepageContent from '../models/HomepageContent.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'site' });
    if (!settings) settings = await SiteSettings.create({ key: 'site' });
    res.json({ settings });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({ key: 'site' }, { $set: req.body }, { new: true, upsert: true, runValidators: true });
    res.json({ settings });
  } catch (err) {
    next(err);
  }
};

export const getHomepageContent = async (req, res, next) => {
  try {
    let content = await HomepageContent.findOne({ key: 'homepage' });
    if (!content) content = await HomepageContent.create({ key: 'homepage' });
    res.json({ content });
  } catch (err) {
    next(err);
  }
};

export const updateHomepageContent = async (req, res, next) => {
  try {
    let content = await HomepageContent.findOne({ key: 'homepage' });
    if (!content) content = new HomepageContent({ key: 'homepage' });

    if (req.files?.heroImage?.[0]) {
      if (content.heroImage?.publicId) await deleteFromCloudinary(content.heroImage.publicId);
      content.heroImage = await uploadBufferToCloudinary(req.files.heroImage[0].buffer, 'filatoco/homepage');
    }
    if (req.files?.aboutImage?.[0]) {
      if (content.aboutImage?.publicId) await deleteFromCloudinary(content.aboutImage.publicId);
      content.aboutImage = await uploadBufferToCloudinary(req.files.aboutImage[0].buffer, 'filatoco/homepage');
    }
    if (req.files?.processImage?.[0]) {
      if (content.processImage?.publicId) await deleteFromCloudinary(content.processImage.publicId);
      content.processImage = await uploadBufferToCloudinary(req.files.processImage[0].buffer, 'filatoco/homepage');
    }

    Object.assign(content, req.body);
    await content.save();
    res.json({ content });
  } catch (err) {
    next(err);
  }
};
