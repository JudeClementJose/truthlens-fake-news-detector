import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
          <ShieldCheck className="w-4 h-4" /> About TruthLens AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Combating Misinformation with Artificial Intelligence
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
          TruthLens is designed to restore trust in digital media by providing instant, explainable, and precision-driven fake news detection.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-brand-500" /> AI & NLP Pipeline Technical Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">1. Text Preprocessing</h5>
            <p className="text-xs text-slate-500">Regex cleaning, lowercasing, stopword removal, and NLTK WordNet Lemmatization.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">2. TF-IDF Vectorization</h5>
            <p className="text-xs text-slate-500">5,000 top n-gram feature representations with unigram and bigram ranges.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">3. Logistic Regression</h5>
            <p className="text-xs text-slate-500">Calibrated probability estimation with feature weight extraction for explainability.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">4. Transformer Modular Design</h5>
            <p className="text-xs text-slate-500">Abstract interface architecture ready for HuggingFace BERT or RoBERTa fine-tuning.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
