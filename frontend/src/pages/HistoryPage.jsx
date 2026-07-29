import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, Trash2, Eye, ShieldCheck, 
  ChevronLeft, ChevronRight, RefreshCw, X
} from 'lucide-react';
import API from '../utils/api';

export const HistoryPage = ({ onViewDetail }) => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [predictionFilter, setPredictionFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [page, category, predictionFilter, startDate, endDate]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {
        query,
        category,
        prediction: predictionFilter,
        start_date: startDate,
        end_date: endDate,
        page,
        per_page: 15
      };
      const response = await API.get('/history', { params });
      setItems(response.data.items);
      setTotalPages(response.data.pages || 1);
      setTotalCount(response.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prediction entry from your history?')) return;
    try {
      await API.delete(`/history/${id}`);
      fetchHistory();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL analysis history?')) return;
    try {
      await API.delete('/history/clear-all');
      fetchHistory();
    } catch (err) {
      alert('Clear history failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Analysis History & Audit Log
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search, filter by date or category, and manage all past fake news checks.
          </p>
        </div>
        
        <button
          onClick={handleClearAll}
          className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-2 hover:bg-red-100 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All History
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search history by keyword or headline..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Politics">Politics</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Business">Business</option>
              <option value="Sports">Sports</option>
              <option value="Science">Science</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Prediction</label>
            <select
              value={predictionFilter}
              onChange={(e) => { setPredictionFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Predictions</option>
              <option value="Fake">Fake News Only</option>
              <option value="Real">Real News Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

        </div>

      </div>

      {/* History Data Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No analysis history records match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Headline / Text</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Prediction</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 max-w-sm truncate font-medium text-slate-900 dark:text-slate-100">
                      {item.headline || item.article}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">
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
                    <td className="py-3 px-4 flex items-center gap-2">
                      <button
                        onClick={() => onViewDetail(item)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                        title="View Full Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <span>Showing Page {page} of {totalPages} ({totalCount} entries)</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
