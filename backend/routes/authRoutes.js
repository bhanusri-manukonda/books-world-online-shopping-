import express from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from '../controllers/authController.js';

const router = express.Router();

// Strict validations per requirements:
// - Name: starts with letter, allows only letters, numbers, spaces, rejects numbers at start and special characters
// - Email: Gmail addresses only (e.g. example@gmail.com)
// - Password: min 8 characters with at least 1 uppercase, 1 lowercase, 1 number, 1 special character
const nameRegex = /^[a-zA-Z][a-zA-Z0-9 ]*$/;
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=-])[A-Za-z\d@$!%*?&#^()_+=-]{8,}$/;

router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required.')
      .matches(nameRegex)
      .withMessage(
        'Name must start with a letter and contain only letters, numbers, and spaces without special characters.'
      ),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required.')
      .matches(gmailRegex)
      .withMessage('Only Gmail addresses (e.g., example@gmail.com) are accepted.'),
    body('password')
      .matches(passwordRegex)
      .withMessage(
        'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
      ),
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required.')
      .matches(gmailRegex)
      .withMessage('Only Gmail addresses (e.g., example@gmail.com) are accepted.'),
    body('password').notEmpty().withMessage('Enter your password.'),
  ],
  validate,
  loginUser
);

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

// Wishlist endpoints
router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:bookId').post(protect, toggleWishlist).delete(protect, removeFromWishlist);

export default router;
