# Legacy System Analysis Report
## College Library Management System — C++ Legacy to Modern Web

---

## 1. Executive Summary

The legacy system is a **monolithic, console-based C++ application** that reads/writes CSV files directly as its "database." It was functional but carried significant technical debt making it unmaintainable, unscalable, and insecure.

---

## 2. Existing Architecture

| Component | Legacy | Modern |
|---|---|---|
| Interface | Console (cin/cout) | React.js Web SPA |
| Backend | C++ monolith | Node.js + Express REST API |
| Database | CSV Files | MongoDB + Mongoose ODM |
| Auth | None | JWT + bcrypt |
| Testing | None | Playwright E2E |
| Deployment | Local compile | Node.js servers |

---

## 3. Functional Modules (Preserved)

### Book Management
- **Legacy:** `add_book()`, `upd_book()`, `del_book()`, `search_book()`, `show_books()`
- **Modern:** `addBook()`, `updateBook()`, `deleteBook()`, `searchBook()`, `displayBooks()`
- REST: `GET/POST/PUT/DELETE /api/books`

### Student Management
- **Legacy:** `reg_student()`, `show_student()`, `search_student()`
- **Modern:** `registerStudent()`, `viewStudentProfile()`, `searchStudent()`
- REST: `GET/POST/PUT/DELETE /api/students`

### Library Operations
- **Legacy:** `issue_book()`, `return_book()`, `check_availability()`, `show_issued()`, `show_fines()`
- **Modern:** `issueBook()`, `returnBook()`, `checkBookAvailability()`, `viewIssuedBooks()`, `displayFineReport()`
- REST: `POST /api/issues`, `PATCH /api/issues/:id/return`, `GET /api/issues/fines`

---

## 4. Code Smell Report

| Smell | Location | Description |
|---|---|---|
| Long Methods | `show_fines()` (~120 lines) | Does filtering, calculation, formatting — violates SRP |
| Short Non-Descriptive Names | `del_book()`, `upd_book()`, `reg_student()` | Cryptic abbreviations |
| Duplicate Code | `search_book()`, `search_student()` | Near-identical search loops |
| God Object | `main.cpp` (900+ lines) | All logic in one file |
| Magic Numbers | `#define DUE_DAYS 14`, `#define FINE_PER_DAY 5` | Better as config |
| Raw Arrays | `Book books[MAX_RECORDS]` | No dynamic sizing |
| No Error Handling | `sscanf`, `atoi` calls | Silent failures on corrupt CSV |
| No Authentication | All menus open to anyone | Security vulnerability |
| File Rewrite on Every Save | `saveBooks()` rewrites entire CSV | O(n) writes every time |
| Hardcoded File Paths | `#define BOOKS_FILE "books.csv"` | Not environment-aware |
| Global Mutable State | Arrays passed by reference everywhere | Hidden side effects |
| No Input Sanitization | Raw `cin >>` for all inputs | Buffer overflow risk |
| Repeated CSV Parsing | Identical parsing in load functions | Code duplication |
| Coupled UI and Business Logic | Print statements inside business functions | No separation of concerns |

---

## 5. Technical Debt Report

| Category | Issues | Impact |
|---|---|---|
| Architecture | No layers, no separation of concerns | High — any change touches everything |
| Security | No auth, no input validation, raw file access | Critical |
| Scalability | Fixed-size arrays (500 records max) | High |
| Maintainability | 900-line single file | High |
| Testability | No unit tests possible | High |
| Data Integrity | No transactions, partial writes possible | Medium |
| Performance | Full CSV rewrite on every save | Medium |
| Concurrency | No locking — data corruption under multi-user | High |

---

## 6. Method Renaming (Legacy → Modern)

| Legacy Method | Modern Method | Reason |
|---|---|---|
| `add_book()` | `addBook()` | Descriptive camelCase |
| `upd_book()` | `updateBook()` | Spell out abbreviation |
| `del_book()` | `deleteBook()` | Spell out abbreviation |
| `search_book()` | `searchBook()` | Consistent naming |
| `show_books()` | `displayBooks()` | Clearer intent |
| `reg_student()` | `registerStudent()` | Full verb form |
| `show_student()` | `viewStudentProfile()` | Intent-revealing |
| `search_student()` | `searchStudent()` | Consistent naming |
| `issue_book()` | `issueBook()` | Consistent naming |
| `return_book()` | `returnBook()` | Consistent naming |
| `check_availability()` | `checkBookAvailability()` | More specific |
| `show_issued()` | `viewIssuedBooks()` | Clearer intent |
| `show_fines()` | `displayFineReport()` | Clearer intent |
| `admin_menu()` | `displayAdminMenu()` | Descriptive |
| `main_menu()` | `displayMainMenu()` | Descriptive |

---

## 7. CSV File Structure Analysis

### books.csv
```
BookID, Title, Author, Category, Quantity, AvailableCopies
```
→ Migrated to: MongoDB `books` collection with `bookId`, `title`, `author`, `category`, `isbn`, `quantity`, `availableCopies`

### students.csv
```
StudentID, Name, Department, Contact
```
→ Migrated to: MongoDB `students` collection with `studentId`, `name`, `email`, `department`, `contactNumber`

### issued_books.csv
```
IssueID, StudentID, BookID, IssueDate, DueDate, ReturnDate, Status, Fine
```
→ Migrated to: MongoDB `issuedbooks` collection with ObjectId references, proper Date types

---

## 8. Security Vulnerabilities Identified

1. **No authentication** — any user could access admin functions
2. **No input validation** — buffer overflow risk with raw `cin`
3. **CSV injection** — user input written directly to CSV (formula injection risk)
4. **No access control** — all menus globally accessible
5. **Plaintext data** — all records in plaintext CSV files

### Remediations Applied
- JWT Authentication with bcrypt password hashing
- Express-validator for API input validation
- Role-Based Access Control (Admin vs Student)
- MongoDB with Mongoose schema validation
- CORS configuration

---

## 9. Refactoring Recommendations Applied

1. ✅ Renamed all methods to descriptive camelCase
2. ✅ Separated concerns: Models, Controllers, Routes, Middleware
3. ✅ Replaced raw arrays with MongoDB collections
4. ✅ Added proper authentication and authorization
5. ✅ Created reusable service layers
6. ✅ Implemented environment-based configuration
7. ✅ Added structured logging (Winston)
8. ✅ Removed all duplicate code
9. ✅ Added input validation at API boundaries
10. ✅ Implemented pagination for all list endpoints

---

## 10. Technology Migration Plan

| Phase | Task | Status |
|---|---|---|
| Phase 1 | Legacy Analysis | ✅ Done |
| Phase 2 | Technology Modernization | ✅ Done |
| Phase 3 | Database Migration (CSV → MongoDB) | ✅ Done |
| Phase 4 | Modern Web Application | ✅ Done |
| Phase 5 | Test Coverage Assessment | ✅ Done |
| Phase 6 | Playwright Automation Framework | ✅ Done |
| Phase 7 | Jira Bug Detection Workflow | ✅ Done |
| Phase 8 | Claude Code Autonomous Workflow | ✅ Done |
