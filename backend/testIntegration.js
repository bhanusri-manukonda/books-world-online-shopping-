import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Book from './models/Book.js';
import Order from './models/Order.js';

dotenv.config();
await connectDB();

const runTests = async () => {
  console.log('--- Starting Integration Verifications ---');

  // 1. Verify 60 books in database
  const bookCount = await Book.countDocuments();
  console.log(`✓ Books count: ${bookCount} (Target: 50+ books)`);
  if (bookCount < 50) throw new Error('Less than 50 books found!');

  // Check sample book fields
  const sampleBook = await Book.findOne();
  console.log('✓ Sample Book:');
  console.log(`  Title: ${sampleBook.title}`);
  console.log(`  Author: ${sampleBook.author}`);
  console.log(`  Category: ${sampleBook.category}`);
  console.log(`  Original Price: ₹${sampleBook.price}`);
  console.log(`  Discount: ${sampleBook.discountPercent}%`);
  console.log(`  Final Price: ₹${sampleBook.finalPrice}`);
  console.log(`  Cover: ${sampleBook.image}`);
  if (!sampleBook.image || sampleBook.image.includes('placehold.co')) {
    console.warn('  Warning: Cover is not a real cover URL');
  }

  // 2. Verify Admin user login
  const admin = await User.findOne({ email: 'admin@gmail.com' });
  if (!admin) throw new Error('Admin user admin@gmail.com not found!');
  const adminMatch = await admin.matchPassword('Admin@123');
  console.log(`✓ Admin user password match: ${adminMatch}`);
  if (!adminMatch) throw new Error('Admin password does not match Admin@123');

  // 3. Test Wishlist functionality
  const user = await User.findOne({ email: 'customer@gmail.com' });
  if (!user) throw new Error('Customer user customer@gmail.com not found!');
  console.log(`✓ Customer user found: ${user.name} (${user.email})`);

  // Add book to wishlist
  user.wishlist = [sampleBook._id];
  await user.save();
  const populatedUser = await User.findById(user._id).populate('wishlist');
  console.log(`✓ Wishlist populated count: ${populatedUser.wishlist.length}`);
  console.log(`  Wishlisted book: ${populatedUser.wishlist[0].title}`);

  // 4. Test recommendations
  const recs = await Book.find({
    _id: { $ne: sampleBook._id },
    $or: [{ category: sampleBook.category }, { author: sampleBook.author }],
  }).limit(6);
  console.log(`✓ Recommendations found for "${sampleBook.title}": ${recs.length} books`);

  // 5. Test Order placement with Andhra Pradesh city
  const testOrder = await Order.create({
    user: user._id,
    orderItems: [
      {
        book: sampleBook._id,
        title: sampleBook.title,
        image: sampleBook.image,
        originalPrice: sampleBook.price,
        discountPercent: sampleBook.discountPercent,
        price: sampleBook.finalPrice,
        qty: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Bhanu Sri',
      address: 'Main Road, Ramaraopeta',
      city: 'Kakinada, Andhra Pradesh',
      postalCode: '533001',
      phone: '9876543210',
    },
    paymentMethod: 'Cash on delivery',
    itemsPrice: sampleBook.finalPrice,
    savedPrice: sampleBook.price - sampleBook.finalPrice,
    shippingPrice: sampleBook.finalPrice > 500 ? 0 : 40,
    totalPrice: sampleBook.finalPrice + (sampleBook.finalPrice > 500 ? 0 : 40),
  });

  console.log(`✓ Order created successfully: ID ${testOrder._id}`);
  console.log(`  Delivery City: ${testOrder.shippingAddress.city}`);
  console.log(`  Items Price: ₹${testOrder.itemsPrice}, Total: ₹${testOrder.totalPrice}`);

  // Clean up test order
  await Order.findByIdAndDelete(testOrder._id);
  console.log('✓ Cleaned up test order.');

  console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY! ---');
  process.exit(0);
};

runTests().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
