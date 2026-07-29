import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, Tag, 
  Download, Share2, ExternalLink, ArrowLeft, RefreshCw, Sparkles, HelpCircle
} from 'lucide-react';
import { generatePDFReport } from '../utils/pdfGenerator';
import { getTrustedSourcesByCategory } from '../utils/trustedSources';

export const ResultPage = ({ result, onNewAnalysis }) => {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-slate-500 text-sm">No analysis result payload found.</p>
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
          >
            Start Analysis
          </button>
        </div>
      </div>
    );
  }

  const isFake = result.prediction === 'Fake';
  const trustedSources = getTrustedSourcesByCategory(result.category);

  // Function to highlight suspicious words inside article text
  const renderHighlightedArticle = () => {
    if (!result.article) return null;

    const suspiciousWords = (result.suspicious_words || []).map(w => w.toLowerCase());
    if (suspiciousWords.length === 0) {
      return <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{result.article}</p>;
    }

    const regexPattern = new RegExp(`\\b(${suspiciousWords.join('|')})\\b`, 'gi');
    const parts = result.article.split(regexPattern);

    return (
      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
        {parts.map((part, index) => {
          const isSuspicious = suspiciousWords.includes(part.toLowerCase());
          if (isSuspicious) {
            return (
              <span
                key={index}
                className="bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold px-1.5 py-0.5 rounded border border-red-300 dark:border-red-800 inline-block my-0.5"
                title="AI Flag: Suspicious/sensationalist term indicator"
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </p>
    );
  };

  const handleShare = () => {
    const textToCopy = `TruthLens AI Result: This news is classified as ${result.prediction} (${result.confidence}% Confidence). Check it out at TruthLens!`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={onNewAnalysis}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Analyze Another Article
      </button>

      {/* Main Result Card */}
      <div className={`glass-panel p-6 sm:p-10 rounded-3xl shadow-2xl border-2 space-y-8 ${
        isFake
          ? 'border-red-500/50 bg-gradient-to-br from-red-500/5 to-slate-900/10'
          : 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/5 to-slate-900/10'
      }`}>

        {/* Top Prediction Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl ${
              isFake ? 'bg-red-600 shadow-red-600/30' : 'bg-emerald-600 shadow-emerald-600/30'
            }`}>
              {isFake ? <AlertTriangle className="w-9 h-9" /> : <CheckCircle2 className="w-9 h-9" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white ${
                  isFake ? 'bg-red-600' : 'bg-emerald-600'
                }`}>
                  {result.prediction} News Detected
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  result.risk_level === 'High'
                    ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
                    : result.risk_level === 'Medium'
                    ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
                }`}>
                  {result.risk_level} Risk
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {isFake ? 'Misinformation Warning' : 'Authentic News Verification'}
              </h2>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => generatePDFReport(result)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow transition-all"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl glass-card text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Share2 className="w-4 h-4" /> {copied ? 'Copied Link!' : 'Share'}
            </button>
          </div>
        </div>

        {/* Confidence Gauge & Stats Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Confidence Score</span>
            <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
              {result.confidence}%
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Category</span>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200 capitalize flex items-center justify-center gap-1">
              <Tag className="w-4 h-4 text-brand-500" /> {result.category || 'General'}
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Processing Time</span>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-brand-500" /> {result.processing_time_ms || 115} ms
            </div>
          </div>
        </div>

        {/* AI Explanation Box */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" /> AI Classification Explanation:
          </h4>
          <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-slate-800/60 border border-brand-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {result.explanation}
          </div>
        </div>

        {/* Text Body with Suspicious Word Highlighting */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Analyzed Text Content:
            </h4>
            {result.suspicious_words && result.suspicious_words.length > 0 && (
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                {result.suspicious_words.length} Suspicious Tokens Highlighted
              </span>
            )}
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
            {result.headline && (
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                {result.headline}
              </h3>
            )}
            {renderHighlightedArticle()}
          </div>
        </div>

        {/* Key Feature Indicators */}
        {result.keywords && result.keywords.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Key Term Impact Weights:
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((kw, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 ${
                    kw.type === 'Fake Indicator'
                      ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/60 dark:border-red-800 dark:text-red-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  <span className="font-bold">{kw.word}</span>
                  <span className="text-[10px] opacity-75">({kw.type})</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Trusted Sources Verification Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Verify with Trusted News Sources
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-reference this article with certified global news agencies and medical organizations.
            </p>
          </div>
          <ShieldCheck className="w-8 h-8 text-brand-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trustedSources.map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all flex items-start justify-between group"
            >
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  {source.name}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {source.description}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-500 shrink-0 ml-2 mt-1" />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};
