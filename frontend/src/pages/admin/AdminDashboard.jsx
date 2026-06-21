import { useState, useEffect, useCallback, useRef } from 'react';
import { issueAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiBook, FiUsers, FiBookOpen, FiAlertCircle, FiDollarSign, FiCheckCircle, FiTrendingUp, FiClock, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#7c3aed', '#4f46e5', '#10b981', '#f59e0b'];
const POLL_INTERVAL = 30_000;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-card px-4 py-3 text-sm">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p className="text-brand-600 font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function LiveBadge({ lastUpdated, refreshing, onRefresh }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  const label = elapsed < 5 ? 'just now'
    : elapsed < 60 ? `${elapsed}s ago`
    : `${Math.floor(elapsed / 60)}m ago`;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Live · updated {label}
      </div>
      <button onClick={onRefresh} disabled={refreshing}
        className="btn-icon text-slate-500 hover:bg-slate-100"
        title="Refresh now">
        <FiRefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchStats = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const { data } = await issueAPI.getDashboardStats();
      setStats(data.data);
      setLastUpdated(Date.now());
    } catch {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    intervalRef.current = setInterval(() => fetchStats(), POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchStats]);

  if (loading) return <LoadingSpinner />;

  const barData = stats ? [
    { name: 'Titles',    value: stats.totalTitles },
    { name: 'Available', value: stats.availableBooks },
    { name: 'Issued',    value: stats.currentlyIssued },
    { name: 'Overdue',   value: stats.overdueBooks },
    { name: 'Returned',  value: stats.totalReturned },
  ] : [];

  const pieData = [
    { name: 'Available', value: stats?.availableBooks || 0 },
    { name: 'Issued',    value: stats?.currentlyIssued || 0 },
  ];

  return (
    <div className="animate-in">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 mb-8 flex items-center justify-between overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #4c1d95 100%)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10"
          style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)', transform: 'translate(30%, -30%)' }} />
        <div>
          <p className="text-violet-300 text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="text-2xl font-bold text-white mb-1">{user?.username} 👋</h1>
          <p className="text-violet-400 text-sm">Here's what's happening in your library today.</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{stats?.overdueBooks || 0}</p>
            <p className="text-violet-300 text-xs mt-0.5">Overdue</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{stats?.currentlyIssued || 0}</p>
            <p className="text-violet-300 text-xs mt-0.5">Active Issues</p>
          </div>
        </div>
      </div>

      {/* Overdue Alert Banner */}
      {stats?.overdueBooks > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <FiAlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="font-bold text-red-800">{stats.overdueBooks} book(s) are overdue</p>
              <p className="text-red-600 text-xs">Fine accumulating at Rs. 5/day. Collect and process returns promptly.</p>
            </div>
          </div>
          <button onClick={() => navigate('/admin/issues')}
            className="btn-danger text-sm flex-shrink-0">
            View Overdue <FiArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Overview</h2>
        {lastUpdated && (
          <LiveBadge lastUpdated={lastUpdated} refreshing={refreshing}
            onRefresh={() => fetchStats(true)} />
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Books"    value={stats?.totalBooks ?? 0}          icon={FiBook}        gradient="violet"  subtitle={`${stats?.totalTitles ?? 0} unique titles`} />
        <StatCard title="Available"      value={stats?.availableBooks ?? 0}       icon={FiCheckCircle} gradient="emerald" />
        <StatCard title="Issued"         value={stats?.currentlyIssued ?? 0}      icon={FiBookOpen}    gradient="amber"   />
        <StatCard title="Students"       value={stats?.totalStudents ?? 0}        icon={FiUsers}       gradient="blue"    />
        <StatCard title="Overdue"        value={stats?.overdueBooks ?? 0}         icon={FiAlertCircle} gradient="red"     />
        <StatCard title="Pending Fine"   value={`Rs. ${stats?.pendingFine ?? 0}`} icon={FiDollarSign}  gradient="amber"   />
        <StatCard title="Collected Fine" value={`Rs. ${stats?.collectedFine ?? 0}`} icon={FiTrendingUp} gradient="emerald" />
        <StatCard title="Total Returned" value={stats?.totalReturned ?? 0}        icon={FiClock}       gradient="indigo"  />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="section-title">Library Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-title">Book Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip formatter={(val) => [val, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
