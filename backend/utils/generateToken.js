import jwt from 'jsonwebtoken';

// Creates a signed JWT that the frontend stores and sends back on every request.
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

export default generateToken;
