const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, addStudent, updateStudent, deleteStudent, getStudentBorrowHistory, getDepartments } = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllStudents);
router.get('/departments', protect, getDepartments);
router.get('/:id', protect, getStudentById);
router.get('/:id/history', protect, getStudentBorrowHistory);
router.post('/', protect, adminOnly, addStudent);
router.put('/:id', protect, adminOnly, updateStudent);
router.delete('/:id', protect, adminOnly, deleteStudent);

module.exports = router;
