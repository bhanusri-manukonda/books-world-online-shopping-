import express from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  updatePricing,
  applyBulkDiscount,
  deleteBook,
  getFilters,
  getDeals,
  getRecommendations,
} from '../controllers/bookController.js';

const router = express.Router();

const bookRules = [
  body('title').trim().notEmpty().withMessage('Enter the book title.'),
  body('author').trim().notEmpty().withMessage('Enter the author name.'),
  body('description').trim().notEmpty().withMessage('Enter a description.'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or more.'),
  body('discountPercent').optional().isFloat({ min: 0, max: 90 })
    .withMessage('Discount must be between 0 and 90 percent.'),
  body('countInStock').isInt({ min: 0 }).withMessage('Stock must be 0 or more.'),
];

// specific paths must come before "/:id" so they are not read as an id
router.get('/filters', getFilters);
router.get('/deals', getDeals);
router.get('/:id/recommendations', getRecommendations);
router.post('/discounts/bulk', protect, admin, applyBulkDiscount);

router.route('/').get(getBooks).post(protect, admin, bookRules, validate, createBook);
router
  .route('/:id')
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);
router.patch('/:id/pricing', protect, admin, updatePricing);

export default router;
