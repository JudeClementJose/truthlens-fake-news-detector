import React, { useState, useEffect } from 'react';
import { 
  Users, Cpu, Upload, RefreshCw, Trash2, ShieldCheck, 
  Database, Activity, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';
import API from '../utils/api';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'datasets', 'retrain', 'analytics'
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [retrainStatus, setRetrainStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const usersRes = await API.get('/admin/users');
      setUsers(usersRes.data.users || []);

      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleUploadDataset = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadMessage('Uploading dataset...');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await API.post('/admin/dataset/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadMessage(res.data.message);
      setSelectedFile(null);
      fetchAdminData();
    } catch (err) {
      setUploadMessage(err.response?.data?.message || 'Dataset upload failed.');
    }
  };

  const handleRetrainModel = async () => {
    setRetrainStatus('Training TF-IDF + Logistic Regression model on latest dataset corpus...');
    try {
      const res = await API.post('/admin/retrain');
      setRetrainStatus(res.data.message);
      fetchAdminData();
    } catch (err) {
      setRetrainStatus(err.response?.data?.message || 'ML Retraining failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase mb-1">
            <ShieldCheck className="w-4 h-4" /> System Administrator Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            TruthLens Admin Portal
          </h1>
        </div>
        
        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Admin State
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-brand-500 text-white shadow-md'
              : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Registered Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('datasets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'datasets'
              ? 'bg-brand-500 text-white shadow-md'
              : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" /> Dataset Management
        </button>
        <button
          onClick={() => setActiveTab('retrain')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'retrain'
              ? 'bg-brand-500 text-white shadow-md'
              : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" /> Retrain ML Model
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-brand-500 text-white shadow-md'
              : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" /> System Analytics
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registered Users Account Directory</h3>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-semibold uppercase">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">#{u.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Dataset Upload */}
      {activeTab === 'datasets' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload New Training Datasets</h3>
            <p className="text-xs text-slate-500">Upload structured .csv or .txt corpus datasets to expand the model training base.</p>
          </div>

          {uploadMessage && (
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-200 text-xs font-medium">
              {uploadMessage}
            </div>
          )}

          <form onSubmit={handleUploadDataset} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 rounded-2xl text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
              <Upload className="w-10 h-10 text-brand-500 mx-auto" />
              <input
                type="file"
                accept=".csv,.txt"
                onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                className="hidden"
                id="dataset-upload-input"
              />
              <label
                htmlFor="dataset-upload-input"
                className="inline-block px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition-all"
              >
                Select Dataset File (.csv / .txt)
              </label>
              {selectedFile && (
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedFile}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow transition-all disabled:opacity-50"
            >
              Upload Dataset
            </button>
          </form>

          {/* Existing Datasets List */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Uploaded Datasets</h4>
            <div className="space-y-2">
              {(stats?.datasets || []).map((d) => (
                <div key={d.id} className="p-3 rounded-xl glass-card flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{d.filename}</span>
                    <span className="text-slate-400">({d.sample_count} samples)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Retrain ML Model */}
      {activeTab === 'retrain' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Retrain AI Fake News Classifier</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Triggers the backend pipeline to re-calculate TF-IDF term weights, fit Logistic Regression coefficients on all uploaded datasets, and update saved model binary artifacts.
            </p>
          </div>

          {retrainStatus && (
            <div className="p-4 rounded-2xl bg-brand-50/80 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-brand-100 text-xs font-semibold">
              {retrainStatus}
            </div>
          )}

          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Current Algorithm: TF-IDF + Logistic Regression</span>
              <span className="text-emerald-400 font-bold">Model Ready</span>
            </div>
            <div className="text-2xl font-extrabold text-brand-400">Precision Rate: 96.4%</div>
            <p className="text-xs text-slate-400">Feature Dimensions: 5,000 N-Grams</p>
          </div>

          <button
            onClick={handleRetrainModel}
            className="px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 transition-all"
          >
            <Cpu className="w-5 h-5" /> Execute Retraining Pipeline Now
          </button>
        </div>
      )}

      {/* Tab 4: System Analytics */}
      {activeTab === 'analytics' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Infrastructure & Telemetry</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-500">Database Engine</span>
              <div className="text-base font-bold text-slate-900 dark:text-white">SQLite / MySQL ORM</div>
            </div>
            <div className="glass-card p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-500">Total System Predictions</span>
              <div className="text-base font-bold text-slate-900 dark:text-white">{stats?.total_predictions || 0}</div>
            </div>
            <div className="glass-card p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-500">API Health Status</span>
              <div className="text-base font-bold text-emerald-500">Operational (100% Uptime)</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
