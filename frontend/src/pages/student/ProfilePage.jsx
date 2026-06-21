import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { FiUser, FiLock, FiSave, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-slate-100 last:border-0 text-sm">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-900 font-semibold capitalize">{value || '—'}</span>
  </div>
);

export default function ProfilePage() {
  const { user } = useAuth();
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  const setField = (k, v) => setPwForm(p => ({ ...p, [k]: v }));

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match.'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally { setSaving(false); }
  };

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Your account information and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="card">
          <h3 className="flex items-center gap-2.5 font-semibold text-slate-800 mb-5">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}>
              <FiUser size={15} className="text-white" />
            </span>
            Account Details
          </h3>

          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mb-3"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <p className="font-bold text-slate-900 text-lg">{user?.username}</p>
            <span className={`mt-1.5 ${user?.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>
              <FiShield size={9} /> {user?.role}
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl px-4 py-1">
            <InfoRow label="Username" value={user?.username} />
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Role" value={user?.role} />
            <InfoRow label="Student ID" value={user?.studentId ? `#${user.studentId}` : 'N/A'} />
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 className="flex items-center gap-2.5 font-semibold text-slate-800 mb-5">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <FiLock size={15} className="text-white" />
            </span>
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: 'Current Password', name: 'currentPassword' },
              { label: 'New Password', name: 'newPassword' },
              { label: 'Confirm New Password', name: 'confirmPassword' }
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="input-label">{label}</label>
                <div className="relative">
                  <input type={showPasswords[name] ? 'text' : 'password'}
                    value={pwForm[name]} onChange={e => setField(name, e.target.value)}
                    placeholder="••••••••" className="input-field pr-10" />
                  <button type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, [name]: !p[name] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium">
                    {showPasswords[name] ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" className="btn-primary" disabled={saving}>
              <FiSave size={15} /> {saving ? 'Saving…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
