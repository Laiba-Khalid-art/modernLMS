const Book = require('../models/Book');
const logger = require('../utils/logger');

const getAllBooks = async (req, res, next) => {
  try {
    const { search, category, available, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = { $regex: category, $options: 'i' };
    if (available === 'true') query.availableCopies = { $gt: 0 };

    const skip = (Number(page) - 1) * Number(limit);
    const [books, total] = await Promise.all([
      Book.find(query).sort({ bookId: 1 }).skip(skip).limit(Number(limit)),
      Book.countDocuments(query)
    ]);
    res.json({ success: true, count: books.length, total, page: Number(page), pages: Math.ceil(total / Number(limit)), data: books });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findOne({ bookId: Number(req.params.id) });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const addBook = async (req, res, next) => {
  try {
    const { title, author, category, isbn, quantity } = req.body;
    const book = await Book.create({ title, author, category, isbn, quantity, availableCopies: quantity });
    logger.info(`Book added: ${book.title} (ID: ${book.bookId})`);
    res.status(201).json({ success: true, message: 'Book added successfully.', data: book });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ bookId: Number(req.params.id) });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    const { title, author, category, isbn, quantity } = req.body;
    if (quantity !== undefined) {
      const issuedCopies = book.quantity - book.availableCopies;
      if (quantity < issuedCopies) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce quantity to ${quantity} — ${issuedCopies} copies are currently issued to students.`
        });
      }
      const diff = quantity - book.quantity;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
      book.quantity = quantity;
    }
    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (isbn !== undefined) book.isbn = isbn;
    await book.save();
    logger.info(`Book updated: ${book.title} (ID: ${book.bookId})`);
    res.json({ success: true, message: 'Book updated successfully.', data: book });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ bookId: Number(req.params.id) });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    const IssuedBook = require('../models/IssuedBook');
    const activeIssues = await IssuedBook.countDocuments({ bookId: book._id, status: 'Issued' });
    if (activeIssues > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${book.title}" — ${activeIssues} copy(s) are currently issued to students.`
      });
    }
    await book.deleteOne();
    logger.info(`Book deleted: ${book.title} (ID: ${book.bookId})`);
    res.json({ success: true, message: 'Book deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const checkBookAvailability = async (req, res, next) => {
  try {
    const book = await Book.findOne({ bookId: Number(req.params.id) });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    res.json({
      success: true,
      data: {
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        quantity: book.quantity,
        availableCopies: book.availableCopies,
        isAvailable: book.availableCopies > 0
      }
    });
  } catch (error) {
    next(error);
  }
};

const getBookCategories = async (req, res, next) => {
  try {
    const categories = await Book.distinct('category');
    res.json({ success: true, data: categories.sort() });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook, checkBookAvailability, getBookCategories };
