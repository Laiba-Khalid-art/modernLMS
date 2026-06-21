import { useState, useEffect } from 'react';
import { issueAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiAlertCircle, FiCheckCircle, FiList, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

const tabs = [
  { key: 'pending',   label: 'Pending Fines',  icon: FiAlertCircle },
  { key: 'collected', label: 'Collected Fines', icon: FiCheckCircle },
  { key: '',          label: 'Full Report',      icon: FiList }
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      const { data: res } = await issueAPI.getFineReport(type || undefined);
      setData(res.data);
      setTotals({ pending: res.totalPending, collected: res.totalCollected });
    } catch { toast.error('Failed to load report.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(activeTab); }, [activeTab]);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const tabTotal = Math.round(data.reduce((s, r) => s + (r.status === 'Returned' ? r.fineAmount : (r.currentFine || 0)), 0));

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="page-title">Fine Reports</h1>
        <p className="page-subtitle">Fine rate: Rs. 5/day after due date · Due period: 14 days</p>
      </div>

      {/* Tab Bar */}
      <div className="card p-1.5 mb-6">
        <div className="flex gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold flex-1 justify-center transition-all duration-200 ${
                activeTab === key
                  ? 'text-white shadow-btn'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
              style={activeTab === key ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' } : {}}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards (Full Report tab only) */}
      {activeTab === '' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <FiAlertCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-amber-700 font-medium">Pending Fines</p>
                <p className="text-2xl font-extrabold text-amber-900">Rs. {Math.round(totals.pending || 0)}</p>
              </div>
            </div>
          </div>
          <div className="card bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <FiDollarSign size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-emerald-700 font-medium">Collected Fines</p>
                <p className="text-2xl font-extrabold text-emerald-900">Rs. {totals.collected || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="fine-report-table">
              <thead className="table-head">
                <tr>
                  {['Issue ID', 'Student', 'Book', 'Due Date', 'Status',
                    ...(activeTab !== 'collected' ? ['Overdue'] : []),
                    'Fine (Rs.)'
                  ].map(h => <th key={h} className="th">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-16 text-slate-400">
                    <FiList size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No records found</p>
                  </td></tr>
                ) : data.map(r => {
                  const fine = r.status === 'Returned' ? r.fineAmount : (r.currentFine || 0);
                  return (
                    <tr key={r._id} className="tr-hover tr-divider">
                      <td className="td font-mono text-xs text-slate-400">#{r.issueId}</td>
                      <td className="td font-semibold text-slate-900">{r.studentId?.name || '—'}</td>
                      <td className="td text-slate-600 max-w-[160px] truncate">{r.bookId?.title || '—'}</td>
                      <td className="td text-slate-500">{fmt(r.dueDate)}</td>
                      <td className="td">
                        {r.status === 'Returned'
                          ? <span className="badge-green"><FiCheckCircle size={9} /> Returned</span>
                          : <span className="badge-yellow"><FiAlertCircle size={9} /> Issued</span>}
                      </td>
                      {activeTab !== 'collected' && (
                        <td className="td text-slate-500">
                          {r.overdueDays > 0
                            ? <span className="text-red-600 font-semibold">{r.overdueDays}d</span>
                            : '—'}
                        </td>
                      )}
                      <td className="td font-bold text-red-700">
                        {fine > 0 ? `Rs. ${Math.round(fine)}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {data.length > 0 && (
                <tfoot>
                  <tr className="bg-violet-50 border-t-2 border-violet-100">
                    <td colSpan={activeTab !== 'collected' ? 6 : 5}
                      className="td font-bold text-slate-700 text-right pr-4">Total Fine</td>
                    <td className="td font-extrabold text-red-700 text-base">Rs. {tabTotal}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
