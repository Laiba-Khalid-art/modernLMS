const IssuedBook = require('../models/IssuedBook');
const Book = require('../models/Book');
const Student = require('../models/Student');
const { calculateFine, getDueDate } = require('../utils/fineCalculator');
const logger = require('../utils/logger');

const DUE_DAYS = Number(process.env.DUE_DAYS) || 14;

const issueBook = async (req, res, next) => {
  try {
    const { studentId, bookId } = req.body;
    const student = await Student.findOne({ studentId: Number(studentId) });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const book = await Book.findOne({ bookId: Number(bookId) });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: `No copies available for "${book.title}".` });
    }

    const alreadyIssued = await IssuedBook.findOne({ studentId: student._id, bookId: book._id, status: 'Issued' });
    if (alreadyIssued) {
      return res.status(400).json({ success: false, message: 'Student already has this book issued.' });
    }

    const MAX_BOOKS = 3;
    const currentlyHeld = await IssuedBook.countDocuments({ studentId: student._id, status: 'Issued' });
    if (currentlyHeld >= MAX_BOOKS) {
      return res.status(400).json({ success: false, message: `Student already has ${currentlyHeld} book(s) issued. Maximum limit is ${MAX_BOOKS}.` });
    }

    const issueDate = new Date();
    const dueDate = getDueDate(issueDate, DUE_DAYS);

    const issuedBook = await IssuedBook.create({
      studentId: student._id,
      bookId: book._id,
      issueDate,
      dueDate,
      status: 'Issued',
      fineAmount: 0
    });

    book.availableCopies -= 1;
    await book.save();

    await issuedBook.populate([
      { path: 'studentId', select: 'studentId name department' },
      { path: 'bookId', select: 'bookId title author' }
    ]);

    logger.info(`Book issued: "${book.title}" to student ${student.name} (Issue ID: ${issuedBook.issueId})`);
    res.status(201).json({
      success: true,
      message: 'Book issued successfully.',
      data: { ...issuedBook.toObject(), finePerDay: Number(process.env.FINE_PER_DAY) || 5, dueDays: DUE_DAYS }
    });
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const issue = await IssuedBook.findOne({ issueId: Number(req.params.issueId) });
    if (!issue) return res.status(404).json({ success: false, message: 'Issue record not found.' });
    if (issue.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'This book has already been returned.' });
    }

    const returnDate = new Date();
    const fine = calculateFine(issue.dueDate, returnDate);
    issue.returnDate = returnDate;
    issue.status = 'Returned';
    issue.fineAmount = fine;
    await issue.save();

    const book = await Book.findById(issue.bookId);
    if (book) {
      book.availableCopies = Math.min(book.availableCopies + 1, book.quantity);
      await book.save();
    }

    await issue.populate([
      { path: 'studentId', select: 'studentId name' },
      { path: 'bookId', select: 'bookId title author' }
    ]);

    const overdueDays = fine > 0 ? Math.round(fine / (Number(process.env.FINE_PER_DAY) || 5)) : 0;
    logger.info(`Book returned: Issue ID ${issue.issueId}, Fine: Rs. ${fine}`);
    res.json({
      success: true,
      message: 'Book returned successfully.',
      data: { ...issue.toObject(), overdueDays }
    });
  } catch (error) {
    next(error);
  }
};

const getAllIssuedBooks = async (req, res, next) => {
  try {
    const { status, studentId, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (studentId) {
      const student = await Student.findOne({ studentId: Number(studentId) });
      if (!student) {
        return res.json({ success: true, count: 0, total: 0, page: 1, pages: 0, data: [] });
      }
      query.studentId = student._id;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [issues, total] = await Promise.all([
      IssuedBook.find(query)
        .populate('studentId', 'studentId name department')
        .populate('bookId', 'bookId title author category')
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      IssuedBook.countDocuments(query)
    ]);
    const today = new Date();
    const enriched = issues.map(issue => {
      const obj = issue.toObject();
      if (issue.status === 'Issued') {
        const overdueDays = Math.max(0, Math.floor((today - issue.dueDate) / (1000 * 60 * 60 * 24)));
        obj.currentFine = overdueDays * (Number(process.env.FINE_PER_DAY) || 5);
        obj.overdueDays = overdueDays;
        obj.isOverdue = overdueDays > 0;
      }
      return obj;
    });
    res.json({ success: true, count: issues.length, total, page: Number(page), pages: Math.ceil(total / Number(limit)), data: enriched });
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req, res, next) => {
  try {
    const issue = await IssuedBook.findOne({ issueId: Number(req.params.issueId) })
      .populate('studentId', 'studentId name department contactNumber')
      .populate('bookId', 'bookId title author category');
    if (!issue) return res.status(404).json({ success: false, message: 'Issue record not found.' });
    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const [
      totalBooks, totalStudents, totalIssued, totalReturned,
      books, overdueCount
    ] = await Promise.all([
      Book.countDocuments(),
      Student.countDocuments(),
      IssuedBook.countDocuments({ status: 'Issued' }),
      IssuedBook.countDocuments({ status: 'Returned' }),
      Book.aggregate([{ $group: { _id: null, totalQty: { $sum: '$quantity' }, totalAvail: { $sum: '$availableCopies' } } }]),
      IssuedBook.countDocuments({ status: 'Issued', dueDate: { $lt: today } })
    ]);

    const pendingFineAgg = await IssuedBook.aggregate([
      { $match: { status: 'Issued', dueDate: { $lt: today } } },
      {
        $addFields: {
          overdueDays: { $divide: [{ $subtract: [today, '$dueDate'] }, 86400000] }
        }
      },
      {
        $group: {
          _id: null,
          totalPendingFine: { $sum: { $multiply: ['$overdueDays', Number(process.env.FINE_PER_DAY) || 5] } }
        }
      }
    ]);

    const collectedFineAgg = await IssuedBook.aggregate([
      { $match: { status: 'Returned', fineAmount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$fineAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBooks: books[0]?.totalQty || 0,
        availableBooks: books[0]?.totalAvail || 0,
        totalTitles: totalBooks,
        totalStudents,
        currentlyIssued: totalIssued,
        totalReturned,
        overdueBooks: overdueCount,
        pendingFine: Math.round(pendingFineAgg[0]?.totalPendingFine || 0),
        collectedFine: collectedFineAgg[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

const getFineReport = async (req, res, next) => {
  try {
    const { type } = req.query;
    const today = new Date();
    let issues;

    if (type === 'pending') {
      issues = await IssuedBook.find({ status: 'Issued', dueDate: { $lt: today } })
        .populate('studentId', 'studentId name department')
        .populate('bookId', 'bookId title author');
      const data = issues.map(issue => {
        const overdueDays = Math.max(0, Math.floor((today - issue.dueDate) / (1000 * 60 * 60 * 24)));
        return { ...issue.toObject(), overdueDays, currentFine: overdueDays * (Number(process.env.FINE_PER_DAY) || 5) };
      });
      const totalPending = data.reduce((sum, r) => sum + r.currentFine, 0);
      return res.json({ success: true, data, totalPending });
    }

    if (type === 'collected') {
      issues = await IssuedBook.find({ status: 'Returned', fineAmount: { $gt: 0 } })
        .populate('studentId', 'studentId name department')
        .populate('bookId', 'bookId title author');
      const totalCollected = issues.reduce((sum, r) => sum + r.fineAmount, 0);
      return res.json({ success: true, data: issues, totalCollected });
    }

    issues = await IssuedBook.find({})
      .populate('studentId', 'studentId name department')
      .populate('bookId', 'bookId title author')
      .sort({ issueDate: -1 });

    const data = issues.map(issue => {
      if (issue.status === 'Issued') {
        const overdueDays = Math.max(0, Math.floor((today - issue.dueDate) / (1000 * 60 * 60 * 24)));
        return { ...issue.toObject(), overdueDays, currentFine: overdueDays * (Number(process.env.FINE_PER_DAY) || 5) };
      }
      return issue.toObject();
    });
    const totalPending = data.filter(r => r.status === 'Issued').reduce((sum, r) => sum + (r.currentFine || 0), 0);
    const totalCollected = data.filter(r => r.status === 'Returned').reduce((sum, r) => sum + (r.fineAmount || 0), 0);
    res.json({ success: true, data, totalPending, totalCollected });
  } catch (error) {
    next(error);
  }
};

module.exports = { issueBook, returnBook, getAllIssuedBooks, getIssueById, getDashboardStats, getFineReport };
