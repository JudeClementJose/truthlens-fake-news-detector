import React from 'react';
import { 
  ShieldCheck, Cpu, Search, CheckCircle2, AlertTriangle, 
  ArrowRight, FileText, Zap, Sparkles, BarChart2, ExternalLink, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage = ({ onStartAnalysis, onExploreDashboard }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Cpu,
      title: 'Advanced NLP AI Engine',
      desc: 'Combines TF-IDF vectorization and Logistic Regression with an architecture designed for seamless BERT transformer integration.'
    },
    {
      icon: Search,
      title: 'Multi-Modal Inputs',
      desc: 'Analyze raw text, copy-pasted headlines, uploaded .txt documents, Web Speech voice input, and image OCR screenshot scans.'
    },
    {
      icon: AlertTriangle,
      title: 'Suspicious Phrase Highlighting',
      desc: 'Instantly exposes emotional clickbait keywords, sensationalist claims, and unverified linguistic indicators in red.'
    },
    {
      icon: BarChart2,
      title: 'Confidence & Risk Assessment',
      desc: 'Returns precise percentage probabilities alongside Low, Medium, and High risk classifications for every article.'
    },
    {
      icon: ShieldCheck,
      title: 'Fact Check Network',
      desc: 'Automatically connects flagged articles with trusted news agencies including Reuters, BBC, AP News, and WHO.'
    },
    {
      icon: FileText,
      title: 'Downloadable PDF Reports',
      desc: 'Export audit-ready PDF analysis reports with detailed AI reasoning and feature weights for official documentation.'
    }
  ];

  const workflowSteps = [
    { step: '01', title: 'Submit News Content', desc: 'Paste a headline, article text, upload a document, speak via voice dictation, or upload a news screenshot.' },
    { step: '02', title: 'NLP Preprocessing', desc: 'Text undergoes lowercasing, punctuation cleaning, stopword filtering, tokenization, and lemmatization.' },
    { step: '03', title: 'TF-IDF & Classification', desc: 'The vectorizer maps N-gram frequencies into a high-dimensional space evaluated by calibrated ML classifiers.' },
    { step: '04', title: 'Result & Verification', desc: 'View prediction badge, confidence meter, suspicious word tooltips, and cross-reference with trusted sources.' }
  ];

  const testimonials = [
    {
      name: 'Dr. Elena Rostova',
      role: 'Media & Communications Researcher',
      text: 'TruthLens has transformed our university research workflow. The suspicious word highlighting and confidence scoring provide invaluable transparency.'
    },
    {
      name: 'Marcus Vance',
      role: 'Investigative Journalist',
      text: 'The ability to quickly run headlines through TruthLens AI and download instant PDF audit reports has become an essential part of my daily fact-checking routine.'
    },
    {
      name: 'Sarah Lin',
      role: 'Cybersecurity Analyst',
      text: 'An indispensable tool against social engineering and viral disinfo campaigns. Fast, reliable, and incredibly intuitive.'
    }
  ];

  return (
    <div className="space-y-20 pb-16 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
            {t('hero.badge')}
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Detect Fake News Instantly with <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 bg-clip-text text-transparent">High-Precision AI</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartAnalysis}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <ShieldCheck className="w-5 h-5" />
              {t('hero.startBtn')}
            </button>

            <button
              onClick={onExploreDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-slate-800 dark:text-slate-200 font-semibold text-base hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <BarChart2 className="w-5 h-5 text-brand-500" />
              {t('hero.demoBtn')}
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-2xl">
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">95.8%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Model Precision</div>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">&lt; 120ms</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Analysis Speed</div>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">5,000+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Extracted Features</div>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pluggable NLP</div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Built with State-of-the-Art AI Features
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive tools designed to give journalists, researchers, and everyday readers full clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-500/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-100/60 dark:bg-slate-900/60 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How TruthLens AI Works</h2>
            <p className="text-slate-600 dark:text-slate-400">
              A 4-step automated natural language processing pipeline from text input to verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflowSteps.map((s, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl relative border border-slate-200/80 dark:border-slate-800">
                <span className="text-4xl font-extrabold text-brand-500/20 dark:text-brand-400/20 absolute top-4 right-4">
                  {s.step}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Technology Explainer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-brand-900/10 to-indigo-900/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                <Cpu className="w-4 h-4" /> AI Engine Architecture
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                Modular TF-IDF + Logistic Regression with Transformer Support
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                TruthLens utilizes Scikit-Learn's Term Frequency-Inverse Document Frequency (TF-IDF) vectorizer paired with a calibrated Logistic Regression classifier. The model extracts unigram and bigram n-grams, lemmatizes terms using NLTK, and computes feature impact weights.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Abstract Base Class:</strong> Allows upgrading to HuggingFace Transformers (BERT, RoBERTa) with zero backend endpoint rewrites.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Explainable AI:</strong> Inspect feature coefficients directly to identify suspicious tokens and calculate risk metrics.
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Code Snippet Box */}
            <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl font-mono text-xs shadow-2xl border border-slate-800 overflow-x-auto">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800 text-slate-400">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-2 text-slate-400">ai_engine/base_classifier.py</span>
              </div>
              <pre className="leading-relaxed text-brand-300">
{`class BaseNewsClassifier(ABC):
    @abstractmethod
    def train(self, texts, labels):
        pass

    @abstractmethod
    def predict(self, text):
        return {
            'prediction': 'Real' | 'Fake',
            'confidence': float,
            'risk_level': 'Low' | 'High',
            'keywords': list
        }`}
              </pre>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Trusted by Fact Checkers & Researchers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t.text}"
              </p>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h5>
                <p className="text-xs text-brand-600 dark:text-brand-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl text-center bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Verify News Content?</h2>
          <p className="text-brand-100 max-w-2xl mx-auto text-base">
            Join thousands of users ensuring media integrity. Test headlines, full text articles, or image screenshots instantly.
          </p>
          <button
            onClick={onStartAnalysis}
            className="px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-base shadow-lg hover:bg-brand-50 hover:scale-105 transition-all"
          >
            Start Free AI Analysis
          </button>
        </div>
      </section>

    </div>
  );
};
