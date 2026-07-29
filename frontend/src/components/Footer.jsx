import React from 'react';
import { ShieldCheck, Heart, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              TruthLens AI
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering global readers with advanced Natural Language Processing and AI to detect fake news, combat misinformation, and restore trust.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActivePage('landing')} className="hover:text-brand-400 transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => setActivePage('detector')} className="hover:text-brand-400 transition-colors">AI Fake News Detector</button>
              </li>
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-brand-400 transition-colors">Analytics Dashboard</button>
              </li>
              <li>
                <button onClick={() => setActivePage('history')} className="hover:text-brand-400 transition-colors">Analysis History</button>
              </li>
            </ul>
          </div>

          {/* Technology & Architecture */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">AI Technology</h4>
            <ul className="space-y-2 text-sm">
              <li>TF-IDF Vectorization</li>
              <li>Logistic Regression ML Model</li>
              <li>NLTK Lemmatization Pipeline</li>
              <li>Pluggable Transformer Architecture (BERT/RoBERTa)</li>
              <li>Confidence & Risk Assessment</li>
            </ul>
          </div>

          {/* Trusted Verification Sources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Fact Check Network</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.reuters.com/fact-check/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-400 transition-colors">
                  Reuters Fact Check <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://apnews.com/ap-fact-check" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-400 transition-colors">
                  AP Fact Check <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.bbc.com/news/reality_check" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-400 transition-colors">
                  BBC Reality Check <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.who.int" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-400 transition-colors">
                  World Health Organization <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TruthLens AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Truth and Integrity in News.
          </p>
        </div>
      </div>
    </footer>
  );
};
