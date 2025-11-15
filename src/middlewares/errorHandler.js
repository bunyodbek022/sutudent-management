// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.isJoi) {
    // Joi validation xatolari
    return res.status(400).json({ error: err.details[0].message });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ error: message });
}
