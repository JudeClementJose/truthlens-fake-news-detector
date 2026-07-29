import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import API from '../utils/api';

export const ForgotPassword = ({ onNavigateLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        <button
          onClick={onNavigateLogin}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Request Processed</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              If an account is associated with <strong>{email}</strong>, a reset link has been dispatched.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : 'Send Reset Instructions'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
