# Modern Library Management System

Re-engineered from a legacy C++ + CSV console application into a full-stack web application.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS + Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT + bcrypt |
| Testing | Playwright |
| Logging | Winston |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone / Open Project
```bash
cd modernLMS
```

### 2. Configure Environment
```bash
cp .env.example backend/.env
# Edit backend/.env with your MongoDB URI and secrets
```

### 3. Install Dependencies
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Playwright
cd ../playwright && npm install && npx playwright install chromium
```

### 4. Migrate Legacy CSV Data to MongoDB
```bash
# From project root (copy books.csv, students.csv, issued_books.csv to root)
node migration/migrate.js
```
This creates:
- 20 books from books.csv
- 15 students from students.csv
- 10 issue records from issued_books.csv
- Default admin: `admin@library.com` / `Admin@1234`

### 5. Run the Application
```bash
# From project root (runs both backend + frontend)
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### 6. Run Playwright Tests
```bash
cd playwright
npm test
# View report:
npm run test:report
```

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@library.com | Admin@1234 |

## Project Structure

```
modernLMS/
├── backend/           # Node.js + Express API
│   ├── controllers/   # Business logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Auth, error handling
│   ├── utils/         # Logger, fine calculator
│   └── server.js
├── frontend/          # React + Vite SPA
│   └── src/
│       ├── pages/     # Admin + Student pages
│       ├── layouts/   # Admin + Student layouts
│       ├── components/# Reusable UI components
│       ├── services/  # API service layer
│       └── context/   # Auth context
├── playwright/        # E2E test framework
│   ├── tests/         # Test specs
│   └── utils/         # Helpers + Jira reporter
├── migration/         # CSV to MongoDB migration
├── jira/              # Jira integration service
├── legacy-analysis/   # Analysis reports
└── reports/           # Logs + test reports
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile |
| GET | /api/auth/users | All users (admin) |

### Books
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/books | List books (paginated, filterable) |
| GET | /api/books/:id | Get book by ID |
| POST | /api/books | Add book (admin) |
| PUT | /api/books/:id | Update book (admin) |
| DELETE | /api/books/:id | Delete book (admin) |
| GET | /api/books/:id/availability | Check availability |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | List students (admin) |
| GET | /api/students/:id | Get student |
| POST | /api/students | Add student (admin) |
| PUT | /api/students/:id | Update student (admin) |
| DELETE | /api/students/:id | Delete student (admin) |
| GET | /api/students/:id/history | Borrow history |

### Issues
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/issues | All issue records (admin) |
| POST | /api/issues | Issue book (admin) |
| PATCH | /api/issues/:id/return | Return book (admin) |
| GET | /api/issues/dashboard | Dashboard stats |
| GET | /api/issues/fines | Fine report |

## Jira Integration

Configure in `backend/.env`:
```
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_api_token
JIRA_PROJECT_KEY=LMS
```

Then:
```bash
# List open tickets
node jira/jiraService.js list-tickets

# Get a ticket
node jira/jiraService.js get-ticket LMS-1

# Update ticket status
node jira/jiraService.js update-status LMS-1 "In Progress"
```

Playwright tests automatically create Jira bug tickets on failure when credentials are configured.

## Fine Calculation

- Due period: **14 days** from issue date
- Fine rate: **Rs. 5/day** after due date
- Auto-calculated on book return
