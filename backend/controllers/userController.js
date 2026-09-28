import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Book from '../models/Book.js';

// @route  GET /api/users (admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @route  GET /api/users/:id (admin)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  res.json(user);
});

// @route  PUT /api/users/:id (admin)
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.isAdmin !== undefined) user.isAdmin = Boolean(req.body.isAdmin);

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    isAdmin: updated.isAdmin,
  });
});

// @route  DELETE /api/users/:id (admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete the account you are signed in with.');
  }

  await Order.deleteMany({ user: user._id });
  await user.deleteOne();
  res.json({ message: 'User deleted.' });
});

// @route  GET /api/users/stats/summary (admin) - numbers for the dashboard
export const getStats = asyncHandler(async (req, res) => {
  const [users, books, orders] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Order.find({}).select('totalPrice savedPrice status'),
  ]);

  res.json({
    users,
    books,
    orders: orders.length,
    revenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    saved: orders.reduce((sum, o) => sum + (o.savedPrice || 0), 0),
    pending: orders.filter((o) => o.status === 'Pending').length,
  });
});
