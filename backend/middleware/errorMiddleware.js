// Runs when no route matched the requested URL.
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// Single place where every thrown error is turned into a JSON response.
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Bad Mongo ObjectId, e.g. /api/books/123
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Record not found.';
  }

  // Duplicate key, e.g. an email that is already registered
  if (err.code === 11000) {
    statusCode = 400;
    message = 'That value is already in use.';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
