import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStats,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.get('/stats/summary', protect, admin, getStats);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
