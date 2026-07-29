import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';

export const Login = ({ onNavigateRegister, onNavigateForgotPassword, onSuccessLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      onSuccessLogin();
    } else {
      setError(res.message);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@truthlens.ai');
      setPassword('Admin@12345');
    } else {
      setEmail('demo@truthlens.ai');
      setPassword('Demo@12345');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In to TruthLens</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Access your analysis history, saved metrics, and AI detector.</p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="p-3 bg-brand-50 dark:bg-brand-950/60 rounded-xl border border-brand-200 dark:border-brand-900 space-y-2">
          <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 block">Quick Demo Login:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('user')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 text-xs font-medium rounded-lg border border-brand-200 dark:border-brand-800 text-slate-700 dark:text-slate-200 hover:bg-brand-100 transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-500" /> Demo User
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 text-xs font-medium rounded-lg border border-brand-200 dark:border-brand-800 text-slate-700 dark:text-slate-200 hover:bg-brand-100 transition-colors flex items-center justify-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" /> System Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
