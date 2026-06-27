import { useState, useEffect, useCallback, useRef } from 'react';
import { issueAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiBook, FiUsers, FiBookOpen, FiAlertCircle, FiDollarSign, FiCheckCircle,
         FiTrendingUp, FiClock, FiRefreshCw, FiArrowRight, FiArrowUpRight,
         FiArrowDownLeft, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const POLL_INTERVAL = 30_000;

const CHART_COLORS = ['#C9A84C', '#3B82F6', '#10B981', '#EF4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-sm"
      style={{ background: '#050A18', border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p className="font-semibold text-white mb-1">{label}</p>
      <p className="font-bold" style={{ color: '#C9A84C' }}>{payload[0].value}</p>
    </div>
  );
};

function LiveBadge({ lastUpdated, refreshing, onRefresh }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    setElapsed(0);
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  const label = elapsed < 5 ? 'just now' : elapsed < 60 ? `${elapsed}s ago` : `${Math.floor(elapsed / 60)}m ago`;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#475569' }}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Live · {label}
      </div>
      <button onClick={onRefresh} disabled={refreshing} className="btn-icon" title="Refresh">
        <FiRefreshCw size={13} className={refreshing ? 'animate-spin' : ''} style={{ color: '#C9A84C' }} />
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
    finally { setLoading(false); setRefreshing(false); }
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
    <div className="animate-in space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="relative rounded-3xl p-7 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0F2040 50%, #0A1A35 100%)',
          border: '1px solid rgba(201,168,76,0.15)',
        }}>
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 pointer-events-none"
          style={{ background: 'radial-gradient(circle at bottom left, rgba(59,130,246,0.06) 0%, transparent 60%)' }} />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'rgba(201,168,76,0.6)' }}>Welcome back</p>
            <h1 className="text-3xl font-black text-white mb-2">
              {user?.username} <span style={{ color: '#C9A84C' }}>✦</span>
            </h1>
            <p className="text-sm" style={{ color: '#475569' }}>
              Here's your library overview for today.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {[
              { label: 'Overdue', value: stats?.overdueBooks || 0, danger: true },
              { label: 'Active Issues', value: stats?.currentlyIssued || 0, danger: false },
            ].map(({ label, value, danger }) => (
              <div key={label} className="text-center px-5 py-3.5 rounded-2xl"
                style={{
                  background: danger && value > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(201,168,76,0.06)',
                  border: `1px solid ${danger && value > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(201,168,76,0.15)'}`,
                }}>
                <p className="text-2xl font-black"
                  style={{ color: danger && value > 0 ? '#F87171' : '#C9A84C' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Overdue Alert ── */}
      {stats?.overdueBooks > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)' }}>
              <FiAlertCircle size={19} className="text-red-400" />
            </div>
            <div>
              <p className="font-bold text-red-400">{stats.overdueBooks} book(s) are overdue</p>
              <p className="text-xs" style={{ color: 'rgba(239,68,68,0.6)' }}>Fine accumulating at Rs. 5/day</p>
            </div>
          </div>
          <button onClick={() => navigate('/admin/issues')} className="btn-danger text-xs flex-shrink-0">
            View Overdue <FiArrowRight size={12} />
          </button>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="section-title">Overview</p>
          {lastUpdated && <LiveBadge lastUpdated={lastUpdated} refreshing={refreshing} onRefresh={() => fetchStats(true)} />}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Books"    value={stats?.totalBooks ?? 0}            icon={FiBook}        gradient="gold"    subtitle={`${stats?.totalTitles ?? 0} unique titles`} />
          <StatCard title="Available"      value={stats?.availableBooks ?? 0}         icon={FiCheckCircle} gradient="emerald" />
          <StatCard title="Issued"         value={stats?.currentlyIssued ?? 0}        icon={FiBookOpen}    gradient="blue"    />
          <StatCard title="Students"       value={stats?.totalStudents ?? 0}          icon={FiUsers}       gradient="violet"  />
          <StatCard title="Overdue"        value={stats?.overdueBooks ?? 0}           icon={FiAlertCircle} gradient="red"     />
          <StatCard title="Pending Fine"   value={`Rs. ${stats?.pendingFine ?? 0}`}   icon={FiDollarSign}  gradient="amber"   />
          <StatCard title="Collected Fine" value={`Rs. ${stats?.collectedFine ?? 0}`} icon={FiTrendingUp}  gradient="emerald" />
          <StatCard title="Total Returned" value={stats?.totalReturned ?? 0}          icon={FiClock}       gradient="indigo"  />
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar Chart */}
        <div className="card lg:col-span-2">
          <p className="section-title">Library Overview</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8CC6A" />
                  <stop offset="100%" stopColor="#C9A84C" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.04)' }} />
              <Bar dataKey="value" fill="url(#goldBar)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <p className="section-title">Book Status</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="42%" innerRadius={55} outerRadius={80}
                dataKey="value" paddingAngle={4} strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Legend
                iconType="circle" iconSize={8}
                wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
              />
              <Tooltip
                formatter={(val) => [val, '']}
                contentStyle={{
                  background: '#050A18',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p className="section-title">Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Issue a Book',   icon: FiArrowUpRight,  path: '/admin/issue',    color: '#C9A84C' },
            { label: 'Return a Book',  icon: FiArrowDownLeft, path: '/admin/return',   color: '#10B981' },
            { label: 'Add Book',       icon: FiBook,          path: '/admin/books',    color: '#3B82F6' },
            { label: 'View Reports',   icon: FiBarChart2,     path: '/admin/reports',  color: '#8B5CF6' },
          ].map(({ label, icon: Icon, path, color }) => (
            <button key={label} onClick={() => navigate(path)}
              className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-200 group hover:-translate-y-0.5"
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(201,168,76,0.08)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${color}30`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.08)'}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
