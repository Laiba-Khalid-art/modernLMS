const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    bookId: {
      type: Number,
      unique: true
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    isbn: {
      type: String,
      trim: true,
      default: ''
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    availableCopies: {
      type: Number,
      min: [0, 'Available copies cannot be negative']
    }
  },
  { timestamps: true }
);

bookSchema.pre('save', async function () {
  if (!this.bookId) {
    const last = await this.constructor.findOne({}, {}, { sort: { bookId: -1 } });
    this.bookId = last ? last.bookId + 1 : 1;
  }
  if (this.availableCopies === undefined) {
    this.availableCopies = this.quantity;
  }
});

bookSchema.virtual('isAvailable').get(function () {
  return this.availableCopies > 0;
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
