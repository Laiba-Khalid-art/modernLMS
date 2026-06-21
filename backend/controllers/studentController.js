const Student = require('../models/Student');
const IssuedBook = require('../models/IssuedBook');
const logger = require('../utils/logger');

const getAllStudents = async (req, res, next) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = { $regex: department, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [students, total] = await Promise.all([
      Student.find(query).sort({ studentId: 1 }).skip(skip).limit(Number(limit)),
      Student.countDocuments(query)
    ]);
    res.json({ success: true, count: students.length, total, page: Number(page), pages: Math.ceil(total / Number(limit)), data: students });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findOne({ studentId: Number(req.params.id) });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

const addStudent = async (req, res, next) => {
  try {
    const { name, email, department, contactNumber } = req.body;
    const student = await Student.create({ name, email, department, contactNumber });
    logger.info(`Student registered: ${student.name} (ID: ${student.studentId})`);
    res.status(201).json({ success: true, message: 'Student registered successfully.', data: student });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ studentId: Number(req.params.id) });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    const { name, email, department, contactNumber } = req.body;
    if (name) student.name = name;
    if (email !== undefined) student.email = email;
    if (department) student.department = department;
    if (contactNumber !== undefined) student.contactNumber = contactNumber;
    await student.save();
    logger.info(`Student updated: ${student.name} (ID: ${student.studentId})`);
    res.json({ success: true, message: 'Student updated successfully.', data: student });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ studentId: Number(req.params.id) });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    const activeIssues = await IssuedBook.countDocuments({ studentId: student._id, status: 'Issued' });
    if (activeIssues > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete "${student.name}" — they have ${activeIssues} book(s) currently issued.` });
    }
    await student.deleteOne();
    logger.info(`Student deleted: ${student.name} (ID: ${student.studentId})`);
    res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getStudentBorrowHistory = async (req, res, next) => {
  try {
    const student = await Student.findOne({ studentId: Number(req.params.id) });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    const issues = await IssuedBook.find({ studentId: student._id })
      .populate('bookId', 'bookId title author category')
      .sort({ issueDate: -1 });
    res.json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Student.distinct('department');
    res.json({ success: true, data: departments.sort() });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStudents, getStudentById, addStudent, updateStudent, deleteStudent, getStudentBorrowHistory, getDepartments };
