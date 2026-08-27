export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(err);

  res.status(statusCode).json({
    message: err.message || 'Server error',
    ...(isProd ? {} : { stack: err.stack }),
  });
};
