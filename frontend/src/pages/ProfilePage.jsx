import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const res = await updateUserProfile({ name, new_password: newPassword });
    setLoading(false);

    if (res.success) {
      setMessage(res.message);
      setNewPassword('');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-brand-500 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-xl">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
        <p className="text-xs text-slate-500">{user?.email} • Role: <span className="uppercase font-bold text-brand-500">{user?.role}</span></p>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-brand-500" /> Account Settings
        </h3>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {message}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email (Read Only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password (Optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep existing password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow transition-all disabled:opacity-50"
          >
            {loading ? 'Updating Profile...' : 'Save Profile Changes'}
          </button>
        </form>

      </div>

    </div>
  );
};
