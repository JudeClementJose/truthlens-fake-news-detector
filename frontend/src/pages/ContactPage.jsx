import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, MapPin, Phone } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Contact & Support</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          Have questions or feedback about TruthLens AI? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-brand-500" />
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm">Email Support</h5>
              <p className="text-xs text-slate-500">support@truthlens.ai</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-brand-500" />
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm">Location</h5>
              <p className="text-xs text-slate-500">San Francisco, CA</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl md:col-span-2 border border-slate-200 dark:border-slate-800 shadow-xl">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">Message Sent!</h4>
              <p className="text-xs text-slate-500">Thank you for reaching out. We will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your message or feedback here..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
