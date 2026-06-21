import { useState, useEffect, useCallback } from 'react';
import { issueAPI } from '../../services/api';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiSearch, FiRefreshCw, FiBookOpen, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const filterOptions = [
  { value: '',         label: 'All Issues' },
  { value: 'Issued',   label: 'Active' },
  { value: 'Returned', label: 'Returned' },
];

export default function AllIssuesPage() {
  const [issues, setIssues]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [status, setStatus]     = useState('Issued');
  const [studentId, setStudentId] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const today = new Date();

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, ...(status && { status }), ...(studentId && { studentId }) };
      const { data } = await issueAPI.getAll(params);
      setIssues(data.data); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load issues.'); }
    finally { setLoading(false); }
  }, [page, status, studentId]);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const handleSearch = (e) => { e.preventDefault(); setStudentId(searchInput); setPage(1); };
  const reset = () => { setSearchInput(''); setStudentId(''); setPage(1); };

  const overdueCount = issues.filter(i => i.isOverdue).length;

  return (
    <div className="animate-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title">All Issues</h1>
          <p className="page-subtitle">Track all book issues, returns, and overdue records</p>
        </div>
        <button onClick={fetchIssues} className="btn-secondary">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Overdue Alert */}
      {status === 'Issued' && overdueCount > 0 && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <FiAlertCircle size={18} className="text-red-600" />
          </div>
          <div>
            <p className="font-bold text-red-800">{overdueCount} overdue issue(s) on this page</p>
            <p className="text-red-600 text-xs">Highlighted in red — fine accumulating at Rs. 5/day</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {filterOptions.map(opt => (
              <button key={opt.value} onClick={() => { setStatus(opt.value); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  status === opt.value
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={status === opt.value ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' } : {}}>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Student ID Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Filter by Student ID…" type="number"
                className="input-field pl-9 py-2 text-sm" />
            </div>
            <button type="submit" className="btn-primary px-4 py-2 text-sm">Filter</button>
            {studentId && (
              <button type="button" onClick={reset} className="btn-secondary px-3 py-2 text-sm">
                <FiRefreshCw size={13} />
              </button>
            )}
          </form>

          <span className="text-xs text-slate-400 ml-auto">{total} records</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {loading ? <LoadingSpinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-head">
                  <tr>
                    {['ID', 'Student', 'Book', 'Issue Date', 'Due Date', 'Return Date', 'Status', 'Fine'].map(h => (
                      <th key={h} className="th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {issues.length === 0 ? (
                    <tr><td colSpan="8" className="text-center py-16 text-slate-400">
                      <FiBookOpen size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No records found</p>
                    </td></tr>
                  ) : issues.map(issue => {
                    const isOverdue = issue.isOverdue;
                    const fine = issue.status === 'Returned' ? issue.fineAmount : (issue.currentFine || 0);
                    return (
                      <tr key={issue._id}
                        className={`tr-divider transition-colors ${isOverdue ? 'bg-red-50 hover:bg-red-100' : 'tr-hover'}`}>
                        <td className="td font-mono text-xs text-slate-400">#{issue.issueId}</td>
                        <td className="td">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{issue.studentId?.name || '—'}</p>
                            <p className="text-xs text-slate-400">ID: {issue.studentId?.studentId}</p>
                          </div>
                        </td>
                        <td className="td">
                          <p className="font-medium text-slate-800 max-w-[160px] truncate">{issue.bookId?.title || '—'}</p>
                          <p className="text-xs text-slate-400">{issue.bookId?.author}</p>
                        </td>
                        <td className="td text-slate-500 text-sm">{fmt(issue.issueDate)}</td>
                        <td className="td text-sm">
                          <span className={isOverdue ? 'text-red-700 font-semibold' : 'text-slate-500'}>
                            {fmt(issue.dueDate)}
                          </span>
                        </td>
                        <td className="td text-slate-500 text-sm">{fmt(issue.returnDate)}</td>
                        <td className="td">
                          {issue.status === 'Returned'
                            ? <span className="badge-green"><FiCheckCircle size={9} /> Returned</span>
                            : isOverdue
                            ? <span className="badge-red"><FiAlertCircle size={9} /> Overdue</span>
                            : <span className="badge-blue"><FiClock size={9} /> Active</span>}
                        </td>
                        <td className="td font-bold">
                          {fine > 0
                            ? <span className={issue.status === 'Returned' ? 'text-slate-700' : 'text-red-700'}>
                                Rs. {Math.round(fine)}
                              </span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pages={pages} total={total} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
