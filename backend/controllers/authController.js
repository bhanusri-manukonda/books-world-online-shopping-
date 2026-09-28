import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Shape the user object sent back to the browser (never include the password).
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  phone: user.phone,
  address: user.address,
  wishlist: user.wishlist || [],
});

// @route  POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('An account with that email already exists.');
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({ ...publicUser(user), token: generateToken(user._id) });
});

// @route  POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Email or password is incorrect.');
  }

  res.json({ ...publicUser(user), token: generateToken(user._id) });
});

// @route  GET /api/auth/profile (private)
export const getProfile = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});

// @route  PUT /api/auth/profile (private)
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Account not found.');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone ?? user.phone;
  user.address = req.body.address ?? user.address;
  if (req.body.password) user.password = req.body.password; // re-hashed by the model

  const updated = await user.save();
  res.json({ ...publicUser(updated), token: generateToken(updated._id) });
});

// @route  GET /api/auth/wishlist (private)
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (!user) {
    res.status(404);
    throw new Error('Account not found.');
  }
  res.json(user.wishlist || []);
});

// @route  POST /api/auth/wishlist/:bookId (private)
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Account not found.');
  }

  const existingIndex = user.wishlist.findIndex(
    (id) => id.toString() === bookId
  );

  let action = '';
  if (existingIndex > -1) {
    user.wishlist.splice(existingIndex, 1);
    action = 'removed';
  } else {
    user.wishlist.push(bookId);
    action = 'added';
  }

  await user.save();
  const populated = await User.findById(req.user._id).populate('wishlist');
  res.json({
    action,
    wishlist: populated.wishlist,
    wishlistIds: user.wishlist,
    message: action === 'added' ? 'Book added to wishlist.' : 'Book removed from wishlist.',
  });
});

// @route  DELETE /api/auth/wishlist/:bookId (private)
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Account not found.');
  }

  user.wishlist = user.wishlist.filter((id) => id.toString() !== bookId);
  await user.save();
  const populated = await User.findById(req.user._id).populate('wishlist');
  res.json({
    action: 'removed',
    wishlist: populated.wishlist,
    wishlistIds: user.wishlist,
    message: 'Book removed from wishlist.',
  });
});
