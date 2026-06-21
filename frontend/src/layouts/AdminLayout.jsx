import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiBook, FiUsers, FiArrowUpRight, FiArrowDownLeft,
  FiBarChart2, FiUserCheck, FiLogOut, FiMenu, FiX, FiBell,
  FiBookOpen, FiAlertCircle
} from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { issueAPI } from '../services/api';
import toast from 'react-hot-toast';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/admin',          label: 'Dashboard',    icon: FiGrid,          end: true },
    ]
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/books',    label: 'Books',        icon: FiBook },
      { to: '/admin/students', label: 'Students',     icon: FiUsers },
    ]
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/issues',   label: 'All Issues',   icon: FiBookOpen },
      { to: '/admin/issue',    label: 'Issue Book',   icon: FiArrowUpRight },
      { to: '/admin/return',   label: 'Return Book',  icon: FiArrowDownLeft },
      { to: '/admin/reports',  label: 'Reports',      icon: FiBarChart2 },
    ]
  },
  {
    label: 'Admin',
    items: [
      { to: '/admin/users',    label: 'Users',        icon: FiUserCheck },
    ]
  }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // Poll overdue count every 30 s for bell badge
  useEffect(() => {
    const fetch = () => issueAPI.getDashboardStats()
      .then(({ data }) => setOverdueCount(data.data.overdueBooks || 0))
      .catch(() => {});
    fetch();
    const t = setInterval(fetch, 30_000);
    return () => clearInterval(t);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── Sidebar ── */}
      <aside
        className={`${collapsed ? 'w-[72px]' : 'w-64'} flex-shrink-0 flex flex-col
                    transition-[width] duration-300 ease-in-out overflow-hidden`}
        style={{ background: 'linear-gradient(180deg, #1a0533 0%, #0f0720 100%)' }}
      >
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-5'} py-5 border-b border-white/5`}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-gradient shadow-btn flex-shrink-0">
            <HiOutlineBookOpen size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight whitespace-nowrap">Library LMS</p>
              <p className="text-violet-400 text-[11px] leading-tight">Admin Panel</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className={`ml-auto p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors ${collapsed ? 'hidden' : 'flex'}`}>
            <FiX size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-5">
          {navGroups.map(({ label, items }) => (
            <div key={label}>
              {!collapsed && (
                <p className="px-5 mb-1.5 text-[10px] font-bold text-white/25 uppercase tracking-widest">{label}</p>
              )}
              <ul className="space-y-0.5">
                {items.map(({ to, label: lbl, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink to={to} end={end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                         ${isActive
                           ? 'bg-brand-gradient text-white shadow-btn'
                           : 'text-white/50 hover:text-white hover:bg-white/8'}`
                      }
                      title={collapsed ? lbl : undefined}
                    >
                      <Icon size={17} className="flex-shrink-0" />
                      {!collapsed && <span>{lbl}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/5 p-3">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-white text-xs font-semibold truncate">{user?.username}</p>
                <p className="text-white/35 text-[10px]">Administrator</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : 'px-2'} py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm w-full`}
            title={collapsed ? 'Logout' : undefined}>
            <FiLogOut size={16} />
            {!collapsed && 'Logout'}
          </button>
          {collapsed && (
            <button onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-full py-2 mt-1 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-colors">
              <FiMenu size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 flex-shrink-0 shadow-sm">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-800">College Library Management System</h2>
          </div>
          <div className="flex items-center gap-3">

            {/* Bell with overdue badge + dropdown */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotif(v => !v)}
                className="btn-icon text-slate-500 hover:bg-slate-100 hover:text-slate-700 relative">
                <FiBell size={18} />
                {overdueCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {overdueCount > 9 ? '9+' : overdueCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-10 w-72 bg-white rounded-2xl shadow-modal border border-slate-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                    <button onClick={() => setShowNotif(false)} className="text-slate-400 hover:text-slate-600"><FiX size={14} /></button>
                  </div>
                  {overdueCount > 0 ? (
                    <div className="p-4">
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                        <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                          <FiAlertCircle size={16} className="text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-800 text-sm">{overdueCount} Overdue Book(s)</p>
                          <p className="text-red-600 text-xs mt-0.5">Fine accumulating at Rs. 5/day</p>
                          <button
                            onClick={() => { navigate('/admin/issues'); setShowNotif(false); }}
                            className="text-xs text-red-700 font-semibold underline mt-1">
                            View all issues →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400">
                      <FiBell size={24} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No overdue books</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-7 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-xs font-bold shadow-btn">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.username}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 animate-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
