import React, { useState, useEffect } from 'react';
import { 
  BarChart2, PieChart as PieIcon, TrendingUp, ShieldCheck, 
  AlertTriangle, CheckCircle2, RefreshCw, Eye, Tag, Calendar
} from 'lucide-react';
import API from '../utils/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

export const Dashboard = ({ onViewDetail }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/stats/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Chart 1: Pie Chart Data (Fake vs Real)
  const pieData = {
    labels: ['Real News', 'Fake News'],
    datasets: [
      {
        data: [stats.real_count, stats.fake_count],
        backgroundColor: ['#10b981', '#ef4444'],
        borderColor: ['#059669', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Monthly Timeline Data
  const monthlyLabels = (stats.monthly_data || []).map(m => m.month);
  const monthlyFake = (stats.monthly_data || []).map(m => m.fake);
  const monthlyReal = (stats.monthly_data || []).map(m => m.real);

  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Real News',
        data: monthlyReal,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
      {
        label: 'Fake News',
        data: monthlyFake,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
      },
    ],
  };

  // Chart 3: Category Distribution Data
  const categoryLabels = Object.keys(stats.category_stats || {});
  const categoryCounts = Object.values(stats.category_stats || {});

  const categoryBarData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Analyses Count',
        data: categoryCounts,
        backgroundColor: 'rgba(12, 141, 228, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Analytics & Verification Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time statistics on fake news detection metrics, category breakdowns, and AI performance.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-brand-500 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            Total Analyses
            <BarChart2 className="w-5 h-5 text-brand-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.total_analyses}
          </div>
          <p className="text-xs text-slate-500">Recorded across all sources</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-red-500 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            Fake News Flagged
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-red-600 dark:text-red-400">
            {stats.fake_count} <span className="text-xs font-semibold text-slate-500">({stats.fake_percentage}%)</span>
          </div>
          <p className="text-xs text-slate-500">High & Medium Risk Content</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            Real News Verified
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.real_count} <span className="text-xs font-semibold text-slate-500">({stats.real_percentage}%)</span>
          </div>
          <p className="text-xs text-slate-500">Verified Authentic News</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            AI Model Accuracy
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {stats.accuracy_rate}%
          </div>
          <p className="text-xs text-slate-500">Avg Confidence: {stats.avg_confidence}%</p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pie Chart: Fake vs Real */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-brand-500" /> Fake vs Real Distribution
          </h3>
          <div className="h-64 flex items-center justify-center p-2">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Bar Chart: Monthly Analysis Graph */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-2 border border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-500" /> Monthly Verification Trends
          </h3>
          <div className="h-64">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-500" /> Most Searched News Categories
        </h3>
        <div className="h-56">
          <Bar data={categoryBarData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Recent Analyses
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">Headline / Text</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Prediction</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {(stats.recent_analyses || []).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-900 dark:text-slate-100">
                    {item.headline || item.article}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {item.category}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.prediction === 'Fake'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {item.prediction}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-brand-600 dark:text-brand-400">
                    {item.confidence}%
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onViewDetail(item)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
