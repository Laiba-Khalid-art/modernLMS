import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true until session is validated

  const logout = useCallback(() => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setUser(null);
  }, []);

  // On every app load, verify the stored token against the server.
  // If the account is deactivated or the token is invalid, the server
  // returns 401 — the axios interceptor clears localStorage and redirects
  // to /login automatically.
  useEffect(() => {
    const token = localStorage.getItem('lms_token');
    if (!token) { setLoading(false); return; }

    authAPI.getProfile()
      .then(({ data }) => {
        // Refresh user data from server (picks up isActive changes)
        const fresh = data.data;
        const merged = {
          id: fresh._id,
          username: fresh.username,
          email: fresh.email,
          role: fresh.role,
          studentId: fresh.studentId
        };
        localStorage.setItem('lms_user', JSON.stringify(merged));
        setUser(merged);
      })
      .catch(() => {
        // 401 (inactive / invalid token) — axios interceptor already
        // cleared localStorage and will redirect; just clear state here.
        logout();
      })
      .finally(() => setLoading(false));
  }, [logout]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('lms_token', data.data.token);
      localStorage.setItem('lms_user', JSON.stringify(data.data.user));
      setUser(data.data.user);
      return { success: true, role: data.data.user.role };
    } finally {
      setLoading(false);
    }
  };

  const isAdmin   = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
