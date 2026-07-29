import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export const ProtectedRoute = ({ children, adminOnly = false, onNavigateLogin }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Authentication Required</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please log in or create an account to access this section.
          </p>
          <button
            onClick={onNavigateLogin}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md transition-all"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center shadow-xl space-y-4">
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Access Denied</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Administrator privileges are required to view this panel.
          </p>
        </div>
      </div>
    );
  }

  return children;
};
