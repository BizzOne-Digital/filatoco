import multer from 'multer';

const storage = multer.memoryStorage();

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, AVIF images are allowed.'));
};

// Kept under Vercel's ~4.5MB serverless request-body ceiling. A file larger than
// this gets rejected by our own validation with a clear message, instead of
// silently failing at the platform level with a non-JSON error the UI can't show.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 8 },
});
