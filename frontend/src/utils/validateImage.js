export const MAX_IMAGE_MB = 4;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

// Mirrors the backend's multer limit (backend/middleware/upload.js) so the
// admin gets an instant, clear warning instead of a mystery upload failure.
export const filterOversizedFiles = (files, toast) => {
  const tooBig = files.filter((f) => f.size > MAX_IMAGE_BYTES);
  if (tooBig.length) {
    toast.error(`${tooBig.map((f) => f.name).join(', ')} ${tooBig.length > 1 ? 'are' : 'is'} over ${MAX_IMAGE_MB}MB — please compress or resize before uploading.`);
  }
  return files.filter((f) => f.size <= MAX_IMAGE_BYTES);
};
