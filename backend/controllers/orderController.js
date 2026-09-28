import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Book from '../models/Book.js';

// @route  POST /api/orders (private)
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty.');
  }

  // Rebuild the order from database prices so totals and discounts cannot be faked.
  const items = [];
  let itemsPrice = 0;
  let savedPrice = 0;

  for (const item of orderItems) {
    const book = await Book.findById(item.book);
    if (!book) {
      res.status(404);
      throw new Error('One of the books is no longer available.');
    }
    if (book.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Only ${book.countInStock} copies of "${book.title}" are left.`);
    }

    const qty = Number(item.qty);
    items.push({
      book: book._id,
      title: book.title,
      image: book.image,
      originalPrice: book.price,
      discountPercent: book.discountPercent,
      price: book.finalPrice, // virtual from the Book model
      qty,
    });

    itemsPrice += book.finalPrice * qty;
    savedPrice += (book.price - book.finalPrice) * qty;
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 40;

  const order = await Order.create({
    user: req.user._id,
    orderItems: items,
    shippingAddress,
    paymentMethod: paymentMethod || 'Cash on delivery',
    itemsPrice,
    savedPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
  });

  // Reduce stock once the order is stored.
  for (const item of items) {
    await Book.findByIdAndUpdate(item.book, { $inc: { countInStock: -item.qty } });
  }

  res.status(201).json(order);
});

// @route  GET /api/orders/myorders (private)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @route  GET /api/orders/:id (private - owner or admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && !req.user.isAdmin) {
    res.status(403);
    throw new Error('You can only view your own orders.');
  }

  res.json(order);
});

// @route  GET /api/orders (admin)
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @route  PUT /api/orders/:id/status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  const { status, isPaid } = req.body;
  if (status) order.status = status;
  if (isPaid !== undefined) {
    order.isPaid = isPaid;
    order.paidAt = isPaid ? Date.now() : undefined;
  }

  const updated = await order.save();
  res.json(updated);
});

// @route  DELETE /api/orders/:id (admin)
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }
  await order.deleteOne();
  res.json({ message: 'Order deleted.' });
});
