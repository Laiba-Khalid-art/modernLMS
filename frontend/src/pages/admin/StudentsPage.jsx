import { useState, useEffect, useCallback } from 'react';
import { studentAPI } from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw, FiUsers, FiEye, FiCheckCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const emptyForm = { name: '', email: '', department: '', contactNumber: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [histStudent, setHistStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await studentAPI.getAll({ page, limit: 10, search });
      setStudents(data.data); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load students.'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const setField = (name, val) => setForm(p => ({ ...p, [name]: val }));
  const openAdd  = () => { setEditStudent(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ name: s.name, email: s.email || '', department: s.department, contactNumber: s.contactNumber || '' });
    setShowModal(true);
  };

  const openHistory = async (s) => {
    setHistStudent(s); setHistLoading(true);
    try { const { data } = await studentAPI.getHistory(s.studentId); setHistory(data.data); }
    catch { toast.error('Failed to load history.'); }
    finally { setHistLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.department) { toast.error('Name and Department are required.'); return; }
    setSaving(true);
    try {
      if (editStudent) {
        await studentAPI.update(editStudent.studentId, form);
        toast.success('Student updated successfully.');
      } else {
        await studentAPI.add(form);
        toast.success('Student registered successfully.');
      }
      setShowModal(false); fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentAPI.delete(deleteTarget.studentId);
      toast.success('Student deleted.'); setDeleteTarget(null); fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally { setDeleting(false); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="animate-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage registered student records</p>
        </div>
        <button data-testid="add-student-btn" onClick={openAdd} className="btn-primary">
          <FiPlus size={16} /> Add Student
        </button>
      </div>

      <div className="card mb-5">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search students by name or email…" className="input-field pl-10"
              data-testid="student-search-input" />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
          <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
            className="btn-secondary px-4"><FiRefreshCw size={15} /></button>
        </form>
      </div>

      <div className="table-wrapper">
        {loading ? <LoadingSpinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="students-table">
                <thead className="table-head">
                  <tr>
                    {['ID', 'Name', 'Department', 'Email', 'Contact', 'Actions'].map(h => (
                      <th key={h} className="th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-16 text-slate-400">
                      <FiUsers size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No students found</p>
                    </td></tr>
                  ) : students.map(s => (
                    <tr key={s._id} className="tr-hover tr-divider">
                      <td className="td font-mono text-xs text-slate-400">#{s.studentId}</td>
                      <td className="td">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                            {s.name[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="td"><span className="badge-blue">{s.department}</span></td>
                      <td className="td text-slate-400">{s.email || '—'}</td>
                      <td className="td text-slate-400">{s.contactNumber || '—'}</td>
                      <td className="td">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openHistory(s)}
                            className="btn-icon text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-400" title="History">
                            <FiEye size={14} />
                          </button>
                          <button data-testid={`edit-student-${s.studentId}`} onClick={() => openEdit(s)}
                            className="btn-icon text-blue-600 hover:bg-blue-50 focus:ring-blue-400" title="Edit">
                            <FiEdit2 size={14} />
                          </button>
                          <button data-testid={`delete-student-${s.studentId}`} onClick={() => setDeleteTarget(s)}
                            className="btn-icon text-red-500 hover:bg-red-50 focus:ring-red-400" title="Delete">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pages={pages} total={total} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editStudent ? `Edit — ${editStudent.name}` : 'Register Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Full Name *</label>
            <input value={form.name} onChange={e => setField('name', e.target.value)}
              placeholder="Ali Hassan" className="input-field" data-testid="student-name-input" />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input type="email" value={form.email} onChange={e => setField('email', e.target.value)}
              placeholder="ali@example.com" className="input-field" data-testid="student-email-input" />
          </div>
          <div>
            <label className="input-label">Department *</label>
            <input value={form.department} onChange={e => setField('department', e.target.value)}
              placeholder="Computer Science" className="input-field" data-testid="student-dept-input" />
          </div>
          <div>
            <label className="input-label">Contact Number</label>
            <input value={form.contactNumber} onChange={e => setField('contactNumber', e.target.value)}
              placeholder="03001234567" className="input-field" data-testid="student-contact-input" />
          </div>
          <div className="flex gap-3 pt-2 justify-end border-t" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving} data-testid="save-student-btn">
              {saving ? 'Saving…' : editStudent ? 'Update Student' : 'Register Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      <Modal isOpen={!!histStudent} onClose={() => setHistStudent(null)}
        title={`Borrow History — ${histStudent?.name}`} size="lg">
        {histLoading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="table-head">
                <tr>
                  {['Book', 'Issue Date', 'Due Date', 'Return Date', 'Status', 'Fine'].map(h => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-400">No borrow history found.</td></tr>
                ) : history.map(h => (
                  <tr key={h._id} className="tr-divider">
                    <td className="td font-medium text-white">{h.bookId?.title || '—'}</td>
                    <td className="td text-slate-400">{fmt(h.issueDate)}</td>
                    <td className="td text-slate-400">{fmt(h.dueDate)}</td>
                    <td className="td text-slate-400">{fmt(h.returnDate)}</td>
                    <td className="td">
                      {h.status === 'Returned'
                        ? <span className="badge-green"><FiCheckCircle size={9} /> Returned</span>
                        : <span className="badge-yellow"><FiClock size={9} /> Issued</span>}
                    </td>
                    <td className="td font-semibold text-red-600">
                      {h.fineAmount > 0 ? `Rs. ${h.fineAmount}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting} title="Delete Student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} />
    </div>
  );
}
