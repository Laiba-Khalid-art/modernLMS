const express = require('express');
const router = express.Router();
const { issueBook, returnBook, getAllIssuedBooks, getIssueById, getDashboardStats, getFineReport } = require('../controllers/issueController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/fines', protect, adminOnly, getFineReport);
router.get('/', protect, adminOnly, getAllIssuedBooks);
router.get('/:issueId', protect, getIssueById);
router.post('/', protect, adminOnly, issueBook);
router.patch('/:issueId/return', protect, adminOnly, returnBook);

module.exports = router;
