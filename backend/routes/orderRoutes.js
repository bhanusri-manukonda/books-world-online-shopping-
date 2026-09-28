import express from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';

const router = express.Router();

const addressRules = [
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Enter the receiver name.'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Enter the street address.'),
  body('shippingAddress.city').trim().notEmpty().withMessage('Enter the city.'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Enter the PIN code.'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Enter a phone number.'),
];

router
  .route('/')
  .post(protect, addressRules, validate, createOrder)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
