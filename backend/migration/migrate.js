/**
 * CSV to MongoDB Migration Script
 * Migrates legacy C++ CSV data into MongoDB collections
 * Run: node migration/migrate.js
 */
require('dotenv').config({
  path: require('path').join(__dirname, '../.env')
});

const FORCE = process.argv.includes('--force');

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Book = require('../models/Book');
const Student = require('../models/Student');
const IssuedBook = require('../models/IssuedBook');
const User = require('../models/User');

const CSV_DIR = path.join(__dirname, '../../');

function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`CSV file not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

async function migrateBooks() {
  const existing = await Book.countDocuments();
  if (existing > 0 && !FORCE) { console.log(`✓ Books already migrated (${existing} records) — skipping. Use --force to re-run.`); return; }
  const rows = parseCSV(path.join(CSV_DIR, 'books.csv'));
  if (!rows.length) { console.log('No books CSV data found.'); return; }
  await Book.deleteMany({});
  const books = rows.map(r => ({
    bookId: Number(r.BookID),
    title: r.Title,
    author: r.Author,
    category: r.Category,
    isbn: '',
    quantity: Number(r.Quantity),
    availableCopies: Number(r.AvailableCopies)
  }));
  await Book.insertMany(books);
  console.log(`✓ Migrated ${books.length} books.`);
}

async function migrateStudents() {
  const existing = await Student.countDocuments();
  if (existing > 0 && !FORCE) { console.log(`✓ Students already migrated (${existing} records) — skipping.`); return; }
  const rows = parseCSV(path.join(CSV_DIR, 'students.csv'));
  if (!rows.length) { console.log('No students CSV data found.'); return; }
  await Student.deleteMany({});
  const students = rows.map(r => ({
    studentId: Number(r.StudentID),
    name: r.Name,
    email: '',
    department: r.Department,
    contactNumber: r.Contact
  }));
  await Student.insertMany(students);
  console.log(`✓ Migrated ${students.length} students.`);
}

async function migrateIssuedBooks() {
  const existing = await IssuedBook.countDocuments();
  if (existing > 0 && !FORCE) { console.log(`✓ Issued books already migrated (${existing} records) — skipping.`); return; }
  const rows = parseCSV(path.join(CSV_DIR, 'issued_books.csv'));
  if (!rows.length) { console.log('No issued_books CSV data found.'); return; }
  await IssuedBook.deleteMany({});

  const issues = [];
  for (const r of rows) {
    const student = await Student.findOne({ studentId: Number(r.StudentID) });
    const book    = await Book.findOne({ bookId: Number(r.BookID) });
    if (!student || !book) {
      console.warn(`  Skipping issue ${r.IssueID}: student or book not found.`);
      continue;
    }
    issues.push({
      issueId: Number(r.IssueID),
      studentId: student._id,
      bookId: book._id,
      issueDate: r.IssueDate ? new Date(r.IssueDate) : new Date(),
      dueDate: r.DueDate ? new Date(r.DueDate) : new Date(),
      returnDate: r.ReturnDate ? new Date(r.ReturnDate) : null,
      status: r.Status || 'Issued',
      fineAmount: Number(r.Fine) || 0
    });
  }
  if (issues.length) await IssuedBook.insertMany(issues);
  console.log(`✓ Migrated ${issues.length} issued book records.`);
}

async function createDefaultAdmin() {
  const existing = await User.findOne({ role: 'admin' });
  if (existing) { console.log('✓ Admin user already exists.'); return; }
  await User.create({
    username: 'admin',
    email: 'admin@library.com',
    password: 'Admin@1234',
    role: 'admin'
  });
  console.log('✓ Default admin created — username: admin, email: admin@library.com, password: Admin@1234');
}

async function run() {
  console.log('\n=== Library Management System - CSV Migration ===\n');
  console.log("Mongo URI:", process.env.MONGODB_URI);

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log('✓ Connected to MongoDB.');
    if (FORCE) console.log('  --force flag set: will re-migrate all data.');

    await migrateBooks();
    await migrateStudents();
    await migrateIssuedBooks();
    await createDefaultAdmin();

    console.log('\n=== Migration completed successfully! ===\n');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}
run();
