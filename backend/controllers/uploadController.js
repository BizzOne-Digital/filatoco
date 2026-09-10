import cloudinary from '../config/cloudinary.js';

// Signs a direct browser -> Cloudinary upload so large files (video) never
// pass through our serverless function's ~4.5MB body limit. The browser
// posts the file straight to Cloudinary using these signed params.
export const getVideoUploadSignature = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'filatoco/products/video';
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET);

  res.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
};
