import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';

// @route  GET /api/books?keyword=&author=&category=&sort=&page=  (public)
export const getBooks = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;
  const { keyword = '', author = '', category = '', sort = 'newest' } = req.query;

  const filter = {};

  // keyword looks in the title and the author name at the same time
  if (keyword.trim()) {
    filter.$or = [
      { title: { $regex: keyword.trim(), $options: 'i' } },
      { author: { $regex: keyword.trim(), $options: 'i' } },
    ];
  }
  if (author.trim()) filter.author = { $regex: author.trim(), $options: 'i' };
  if (category.trim()) filter.category = category.trim();

  const sortOptions = {
    newest: { createdAt: -1 },
    title: { title: 1 },
    author: { author: 1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    discount: { discountPercent: -1 },
  };

  const count = await Book.countDocuments(filter);
  const books = await Book.find(filter)
    .sort(sortOptions[sort] || sortOptions.newest)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ books, page, pages: Math.ceil(count / pageSize) || 1, count });
});

// @route  GET /api/books/filters (public) - values for the dropdowns
export const getFilters = asyncHandler(async (req, res) => {
  const [categories, authors] = await Promise.all([
    Book.distinct('category'),
    Book.distinct('author'),
  ]);
  res.json({ categories: categories.sort(), authors: authors.sort() });
});

// @route  GET /api/books/deals (public) - biggest discounts for the home page
export const getDeals = asyncHandler(async (req, res) => {
  const books = await Book.find({ discountPercent: { $gt: 0 } })
    .sort({ discountPercent: -1 })
    .limit(4);
  res.json(books);
});

// @route  GET /api/books/:id (public)
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('That book is no longer available.');
  }
  res.json(book);
});

// @route  GET /api/books/:id/recommendations (public)
export const getRecommendations = asyncHandler(async (req, res) => {
  const current = await Book.findById(req.params.id);
  if (!current) {
    res.status(404);
    throw new Error('That book is no longer available.');
  }

  // Find books with matching category or author, excluding current book
  let recommended = await Book.find({
    _id: { $ne: current._id },
    $or: [{ category: current.category }, { author: current.author }],
  })
    .sort({ discountPercent: -1, rating: -1 })
    .limit(6);

  // If fewer than 4 are found, backfill with other top-rated/discounted books
  if (recommended.length < 4) {
    const existingIds = [current._id, ...recommended.map((b) => b._id)];
    const additional = await Book.find({ _id: { $nin: existingIds } })
      .sort({ rating: -1, discountPercent: -1 })
      .limit(6 - recommended.length);
    recommended = [...recommended, ...additional];
  }

  res.json(recommended);
});

// @route  POST /api/books (admin)
export const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(book);
});

// @route  PUT /api/books/:id (admin)
export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('That book is no longer available.');
  }

  const fields = [
    'title', 'author', 'description', 'category',
    'price', 'discountPercent', 'countInStock', 'image',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) book[field] = req.body[field];
  });

  const updated = await book.save();
  res.json(updated);
});

// @route  PATCH /api/books/:id/pricing (admin) - quick price or discount edit
export const updatePricing = asyncHandler(async (req, res) => {
  const { price, discountPercent } = req.body;

  if (price !== undefined && Number(price) < 0) {
    res.status(400);
    throw new Error('Price must be 0 or more.');
  }
  if (discountPercent !== undefined && (Number(discountPercent) < 0 || Number(discountPercent) > 90)) {
    res.status(400);
    throw new Error('Discount must be between 0 and 90 percent.');
  }

  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('That book is no longer available.');
  }

  if (price !== undefined) book.price = Number(price);
  if (discountPercent !== undefined) book.discountPercent = Number(discountPercent);

  const updated = await book.save();
  res.json(updated);
});

// @route  POST /api/books/discounts/bulk (admin) - one discount for a whole category
export const applyBulkDiscount = asyncHandler(async (req, res) => {
  const { category = '', discountPercent } = req.body;
  const value = Number(discountPercent);

  if (Number.isNaN(value) || value < 0 || value > 90) {
    res.status(400);
    throw new Error('Discount must be between 0 and 90 percent.');
  }

  const filter = category ? { category } : {};
  const result = await Book.updateMany(filter, { $set: { discountPercent: value } });

  res.json({
    message: `${result.modifiedCount} book(s) now have a ${value}% discount.`,
    modified: result.modifiedCount,
  });
});

// @route  DELETE /api/books/:id (admin)
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('That book is no longer available.');
  }
  await book.deleteOne();
  res.json({ message: 'Book deleted.' });
});
