import React, { useState } from 'react';
import { 
  ShieldCheck, FileText, Upload, Mic, Image as ImageIcon, 
  Sparkles, Trash2, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle
} from 'lucide-react';
import API from '../utils/api';

const SAMPLE_PRESETS = [
  {
    title: 'Real News Sample (Space Tech)',
    category: 'Science',
    headline: "NASA's James Webb Telescope detects water vapor on distant rocky exoplanet.",
    article: "Astronomers utilizing the James Webb Space Telescope have detected clear atmospheric signatures of water vapor around a rocky exoplanet located 48 light-years away in the habitable zone."
  },
  {
    title: 'Fake News Sample (Conspiracy)',
    category: 'Politics',
    headline: "SHOCKING: Secret deep state lab exposed leaking mind-control chemicals into public tap water!",
    article: "Whistleblowers reveal secret government facility exposing unsuspecting citizens to experimental cognitive control frequencies to influence local election outcomes."
  },
  {
    title: 'Real News Sample (Business)',
    category: 'Business',
    headline: "Central Bank holds benchmark interest rate steady as inflation metrics ease.",
    article: "The Federal Reserve Board announced today that benchmark interest rates will remain unchanged following consecutive quarterly reports showing consumer price index stabilization."
  },
  {
    title: 'Fake News Sample (Health Miracle)',
    category: 'Health',
    headline: "Doctors BANNED from revealing 100% natural miracle cure that eliminates diabetes overnight!",
    article: "Big Pharma is attempting to ban this simple household plant extract that destroys high blood pressure and reverses diabetes in less than 24 hours without medication."
  }
];

export const DetectorPage = ({ onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'file', 'voice', 'ocr'
  const [headline, setHeadline] = useState('');
  const [article, setArticle] = useState('');
  const [category, setCategory] = useState('General');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Preset Selection
  const applyPreset = (preset) => {
    setActiveTab('text');
    setHeadline(preset.headline);
    setArticle(preset.article);
    setCategory(preset.category);
    setError('');
  };

  // Handle Clear Input
  const handleClear = () => {
    setHeadline('');
    setArticle('');
    setSelectedFile(null);
    setSelectedImage(null);
    setError('');
  };

  // Voice Input Handler (Web Speech API)
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice dictation is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setArticle(prev => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.start();
    } catch (err) {
      setError('Voice recognition error: ' + err.message);
      setIsRecording(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;

      if (activeTab === 'text') {
        if (!headline && !article) {
          setError('Please enter a headline or article text for analysis.');
          setLoading(false);
          return;
        }
        response = await API.post('/analyze', { headline, article, category, source_type: 'text' });
      } else if (activeTab === 'file') {
        if (!selectedFile) {
          setError('Please select a .txt file to upload.');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('category', category);
        response = await API.post('/analyze/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (activeTab === 'ocr') {
        if (!selectedImage) {
          setError('Please select an image file to scan.');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('category', category);
        response = await API.post('/analyze/ocr', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (activeTab === 'voice') {
        if (!article) {
          setError('Please speak or type text into the voice transcription box.');
          setLoading(false);
          return;
        }
        response = await API.post('/analyze', { headline: 'Voice Transcription', article, category, source_type: 'voice' });
      }

      setLoading(false);
      if (response && response.data) {
        onAnalysisComplete(response.data);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'AI analysis failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Page Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
          <ShieldCheck className="w-4 h-4" /> AI Natural Language Analysis Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          TruthLens Fake News Detector
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
          Analyze news articles, headlines, documents, or screenshots to evaluate real vs fake probability using advanced NLP.
        </p>
      </div>

      {/* Main Analysis Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Category Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Category:
          </div>
          <div className="flex flex-wrap gap-2">
            {['General', 'Politics', 'Technology', 'Health', 'Business', 'Sports', 'Science', 'Entertainment'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'text'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Headline / Article Text
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'file'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload (.txt)
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'voice'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" /> Voice Input
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'ocr'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> OCR Scan (Image)
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tab 1: Text Input */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  News Headline (Optional)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Paste breaking news headline here..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full News Article Text
                </label>
                <textarea
                  rows={6}
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  placeholder="Paste full article text, body copy, or claim here..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                />
              </div>
            </div>
          )}

          {/* Tab 2: File Upload (.txt) */}
          {activeTab === 'file' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 rounded-2xl text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
              <Upload className="w-10 h-10 text-brand-500 mx-auto" />
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Select a document file (.txt)
                </span>
                <p className="text-xs text-slate-500">Maximum file size: 16 MB</p>
              </div>
              <input
                type="file"
                accept=".txt"
                onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="inline-block px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition-all"
              >
                Choose Document File
              </label>
              {selectedFile && (
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-2">
                  Selected File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Voice Input */}
          {activeTab === 'voice' && (
            <div className="space-y-4 text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-xl transition-all ${
                  isRecording
                    ? 'bg-red-500 animate-pulse scale-110'
                    : 'bg-brand-600 hover:bg-brand-700'
                }`}
              >
                <Mic className="w-8 h-8" />
              </button>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {isRecording ? 'Listening... Speak news article clearly.' : 'Click microphone to dictate news article.'}
              </p>

              <textarea
                rows={5}
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                placeholder="Voice dictation text will transcribe here live..."
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          {/* Tab 4: OCR Screenshot Scan */}
          {activeTab === 'ocr' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 rounded-2xl text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
              <ImageIcon className="w-10 h-10 text-brand-500 mx-auto" />
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Upload News Screenshot / Article Image
                </span>
                <p className="text-xs text-slate-500">Supports PNG, JPG, JPEG</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0] || null)}
                className="hidden"
                id="ocr-upload-input"
              />
              <label
                htmlFor="ocr-upload-input"
                className="inline-block px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition-all"
              >
                Select News Screenshot Image
              </label>
              {selectedImage && (
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-2">
                  Selected Image: {selectedImage.name}
                </div>
              )}
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Clear Input
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Analyzing with AI Engine...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Submit for AI Analysis <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* Preset Test Cases */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Quick Sample Presets for Instant Testing:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => applyPreset(preset)}
              className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition-all hover:scale-[1.01] space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{preset.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {preset.category}
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 font-medium">
                "{preset.headline}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
