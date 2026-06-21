import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/auth/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BooksPage from './pages/admin/BooksPage';
import StudentsPage from './pages/admin/StudentsPage';
import IssueBookPage from './pages/admin/IssueBookPage';
import ReturnBookPage from './pages/admin/ReturnBookPage';
import ReportsPage from './pages/admin/ReportsPage';
import UsersPage from './pages/admin/UsersPage';
import AllIssuesPage from './pages/admin/AllIssuesPage';
import StudentDashboard from './pages/student/StudentDashboard';
import SearchBooksPage from './pages/student/SearchBooksPage';
import BorrowedBooksPage from './pages/student/BorrowedBooksPage';
import ProfilePage from './pages/student/ProfilePage';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Verifying session…</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  return children;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  return (
    <Routes>
      <Route path="/" element={!loading && user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <LandingPage />} />
      <Route path="/login" element={!loading && user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="issue" element={<IssueBookPage />} />
        <Route path="return" element={<ReturnBookPage />} />
        <Route path="issues" element={<AllIssuesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="search" element={<SearchBooksPage />} />
        <Route path="borrowed" element={<BorrowedBooksPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <AppRoutes />
    </AuthProvider>
  );
}
