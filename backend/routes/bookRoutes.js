const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, addBook, updateBook, deleteBook, checkBookAvailability, getBookCategories } = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getAllBooks);
router.get('/categories', protect, getBookCategories);
router.get('/:id', protect, getBookById);
router.get('/:id/availability', protect, checkBookAvailability);
router.post('/', protect, adminOnly, addBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
