import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPlus, FiToggleLeft, FiToggleRight, FiShield, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const emptyForm = { username: '', email: '', password: '', role: 'student', studentId: '' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try { const { data } = await authAPI.getAllUsers(); setUsers(data.data); }
    catch { toast.error('Failed to load users.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) { toast.error('Fill all required fields.'); return; }
    setSaving(true);
    try {
      await authAPI.register(form);
      toast.success('User created successfully.');
      setShowModal(false); setForm(emptyForm); fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    try { await authAPI.toggleUserStatus(id); toast.success('User status updated.'); fetchUsers(); }
    catch { toast.error('Failed to update status.'); }
  };

  return (
    <div className="animate-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage system accounts and access roles</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FiPlus size={16} /> Add User
        </button>
      </div>

      <div className="table-wrapper">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {['User', 'Email', 'Role', 'Student ID', 'Status', 'Action'].map(h => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-16 text-slate-400">
                    <FiUser size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No users found</p>
                  </td></tr>
                ) : users.map(u => (
                  <tr key={u._id} className="tr-hover tr-divider">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: u.role === 'admin'
                            ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                            : 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}>
                          {u.username[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900">{u.username}</span>
                      </div>
                    </td>
                    <td className="td text-slate-500">{u.email}</td>
                    <td className="td">
                      {u.role === 'admin'
                        ? <span className="badge-purple"><FiShield size={9} /> Admin</span>
                        : <span className="badge-blue"><FiUser size={9} /> Student</span>}
                    </td>
                    <td className="td text-slate-500 font-mono text-xs">
                      {u.studentId ? `#${u.studentId}` : '—'}
                    </td>
                    <td className="td">
                      {u.isActive
                        ? <span className="badge-green">Active</span>
                        : <span className="badge-red">Inactive</span>}
                    </td>
                    <td className="td">
                      <button onClick={() => handleToggle(u._id)}
                        className={`btn-icon ${u.isActive
                          ? 'text-red-500 hover:bg-red-50 focus:ring-red-400'
                          : 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-400'}`}
                        title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create User">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Username *', name: 'username', type: 'text', ph: 'johndoe' },
            { label: 'Email *', name: 'email', type: 'email', ph: 'john@example.com' },
            { label: 'Password *', name: 'password', type: 'password', ph: '••••••••' }
          ].map(({ label, name, type, ph }) => (
            <div key={name}>
              <label className="input-label">{label}</label>
              <input type={type} value={form[name]} onChange={e => setField(name, e.target.value)}
                placeholder={ph} className="input-field" />
            </div>
          ))}
          <div>
            <label className="input-label">Role *</label>
            <select value={form.role} onChange={e => setField('role', e.target.value)} className="input-field">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.role === 'student' && (
            <div>
              <label className="input-label">Student ID (optional)</label>
              <input type="number" value={form.studentId} onChange={e => setField('studentId', e.target.value)}
                placeholder="1001" className="input-field" />
            </div>
          )}
          <div className="flex gap-3 pt-2 justify-end border-t border-slate-100">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
