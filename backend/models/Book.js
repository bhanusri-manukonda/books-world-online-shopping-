import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: 'General' },

    // price          = printed / original price
    // discountPercent = 0 to 90, set by the admin
    // finalPrice      = calculated below, never stored
    price: { type: Number, required: true, min: 0, default: 0 },
    discountPercent: { type: Number, required: true, min: 0, max: 90, default: 0 },

    countInStock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    // virtuals: true makes finalPrice and youSave appear in every API response
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// What the customer actually pays, rounded to a whole rupee.
bookSchema.virtual('finalPrice').get(function () {
  return Math.round((this.price * (100 - this.discountPercent)) / 100);
});

// How much is knocked off the printed price.
bookSchema.virtual('youSave').get(function () {
  return this.price - Math.round((this.price * (100 - this.discountPercent)) / 100);
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
