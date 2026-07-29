# TruthLens – AI-Based Fake News Detector

TruthLens is a modern, full-stack, AI-powered web application that leverages Natural Language Processing (NLP) and Machine Learning to classify news headlines, full text articles, uploaded `.txt` documents, voice dictation, and image screenshots as **Real News** or **Fake News**.

![TruthLens AI Shield](https://img.shields.io/badge/TruthLens-v1.0.0-0c8de4)
![Python Flask](https://img.shields.io/badge/Backend-Python%20Flask-3776AB)
![React + Vite](https://img.shields.io/badge/Frontend-React.js%20%2B%20Tailwind%20CSS-61DAFB)
![ML Architecture](https://img.shields.io/badge/AI%2FML-Scikit--learn%20%7C%20Pluggable%20BERT-FF6F00)

---

## 🌟 Key Features

### 🔍 AI Fake News Detection
- **Headline & Article Analysis**: Paste breaking news headlines or full body text for instant classification.
- **Document Upload**: Upload `.txt` files for batch analysis.
- **Voice Dictation Input**: Speak news reports live via Web Speech API transcription.
- **OCR Screenshot Scan**: Scan article screenshots to extract and analyze text content.
- **Explainable AI Output**: View Real/Fake prediction, confidence percentage gauge, risk level (Low, Medium, High), detailed reasoning, and suspicious phrase tooltips highlighted in red.
- **Downloadable PDF Reports**: Export audit-ready PDF analysis reports.
- **Trusted Sources Network**: Cross-reference predictions directly with global fact-checking partners including **Reuters**, **BBC Reality Check**, **AP News**, and the **World Health Organization (WHO)**.

### 📊 Interactive Analytics Dashboard
- Summary Metric Cards: Total Analyses, Fake News Flagged, Real News Verified, and AI Accuracy Rate.
- **Pie Chart**: Fake vs Real distribution ratio.
- **Bar & Line Graphs**: Monthly verification trends and category breakdown (Politics, Technology, Health, Business, Sports, Science, Entertainment).
- Recent Analyses table with instant view modal.

### 📜 Search History & Audit Log
- Store all previous analyses with full persistence.
- Filter history by Date Range, Category, or Prediction Status (Real / Fake).
- Delete individual records or clear user history.

### 🛡️ Secure Admin Portal
- Administrative login with user account management (view & delete users).
- Custom dataset upload (`.csv` / `.txt`).
- One-click dynamic ML model retraining.
- Real-time system telemetry & analytics.

### 🎨 Modern UI/UX
- Responsive design with smooth micro-animations, glassmorphism card panels, dark mode toggle, and multi-language support (English, Spanish, French).

---

## 🏗️ Project Folder Structure

```
truthlens/
├── backend/
│   ├── app.py                  # Main Flask application & blueprint registrations
│   ├── config.py               # Configuration settings (JWT, DB URI, Upload dirs)
│   ├── database.py             # SQLAlchemy DB initialization
│   ├── models.py               # User, Prediction, Admin, Dataset SQLAlchemy models
│   ├── auth_utils.py           # JWT token generation, verification, and route decorators
│   ├── seed_data.py            # Initial seed data for demo predictions & admin
│   ├── requirements.txt        # Python backend dependencies
│   ├── routes/
│   │   ├── auth_routes.py      # Registration, Login, Profile, Forgot Password
│   │   ├── analyze_routes.py   # AI detection, OCR image processing, TXT upload
│   │   ├── history_routes.py   # Analysis history search, filter, delete
│   │   ├── stats_routes.py     # Aggregated stats for dashboard & charts
│   │   └── admin_routes.py     # User management, dataset upload, ML retraining
│   └── ai_engine/
│       ├── base_classifier.py  # Abstract base class contract for classifier engines
│       ├── tfidf_classifier.py # TF-IDF + Logistic Regression model & token highlight logic
│       ├── preprocessor.py     # Text cleaning, lowercasing, punctuation, lemmatization
│       ├── train_model.py      # Pre-training script & default dataset generator
│       └── saved_models/       # Saved model.pkl & vectorizer.pkl binaries
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Proxy configuration (/api -> http://127.0.0.1:5000)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # Main routing & state manager
│       ├── index.css           # Glassmorphism & dark mode CSS
│       ├── context/
│       │   ├── AuthContext.jsx # JWT state & login/register handlers
│       │   ├── ThemeContext.jsx# Light/Dark mode state manager
│       │   └── LanguageContext.jsx # Multi-language dictionary (EN, ES, FR)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Toast.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx # Hero, Features, How it works, AI Tech, Testimonials
│       │   ├── Login.jsx       # Quick demo login buttons (User / Admin)
│       │   ├── Register.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── DetectorPage.jsx# Multi-modal input tabs & sample presets
│       │   ├── ResultPage.jsx  # Confidence meter, suspicious word highlighting, PDF export
│       │   ├── Dashboard.jsx   # Metrics, Pie chart, Monthly trend chart, Categories
│       │   ├── HistoryPage.jsx # Search, date/category filters, delete entries
│       │   ├── ProfilePage.jsx
│       │   ├── AdminPage.jsx   # User management, dataset upload, retraining
│       │   ├── AboutPage.jsx
│       │   └── ContactPage.jsx
│       └── utils/
│           ├── api.js          # Axios wrapper with JWT token interceptor
│           ├── pdfGenerator.js # Client-side PDF report generator
│           └── trustedSources.js# Fact-checking sources database
├── database/
│   └── truthlens_schema.sql    # MySQL 8.0+ DDL database schema
└── README.md
```

---

## 🤖 AI Model Architecture & Pluggability

TruthLens is designed around the **`BaseNewsClassifier`** abstract base class:

```python
class BaseNewsClassifier(ABC):
    @abstractmethod
    def train(self, texts, labels): pass
    @abstractmethod
    def predict(self, text): pass
    @abstractmethod
    def save_model(self, model_dir): pass
    @abstractmethod
    def load_model(self, model_dir): pass
```

### Default Implementation: TF-IDF + Logistic Regression
- **Preprocessing**: Cleans raw text by removing URLs, HTML tags, punctuation, and numbers; filters stopwords; and applies NLTK WordNet Lemmatization.
- **Vectorization**: `TfidfVectorizer` computes n-gram term frequencies over 5,000 max features with `(1, 2)` n-gram ranges.
- **Classification**: `LogisticRegression(C=1.5, max_iter=1000)` predicts class probabilities and feature impact coefficients.

### Swapping to Transformer Models (BERT / RoBERTa)
To replace the TF-IDF engine with a fine-tuned HuggingFace Transformer model:
1. Create a class `TransformerNewsClassifier(BaseNewsClassifier)` in `ai_engine/transformer_classifier.py`.
2. Implement `train()`, `predict()`, `save_model()`, and `load_model()` using PyTorch/HuggingFace `AutoModelForSequenceClassification`.
3. Update `ai_engine/analyze_routes.py` to instantiate `TransformerNewsClassifier`. No backend route or frontend code changes are needed!

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.9+
- Node.js 18+ and npm

### 1. Setup & Run Backend (Flask)

```bash
cd backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask application
python app.py
```
Backend will start at `http://127.0.0.1:5000`.

### 2. Setup & Run Frontend (React + Vite)

```bash
cd frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will start at `http://localhost:5173`.

---

## 🔐 Credentials & Quick Testing

### Demo Accounts
- **Demo User**: Email: `demo@truthlens.ai` | Password: `Demo@12345`
- **System Admin**: Email: `admin@truthlens.ai` | Password: `Admin@12345`

*(Both accounts can be logged in with a single click using the Quick Demo Login buttons on the Sign In page.)*

---

## 🛢️ Database Configuration (SQLite & MySQL)

- **Default (Zero-Config)**: The application automatically initializes a local `truthlens.db` SQLite database out of the box with seeded demo predictions and admin accounts.
- **MySQL Setup**:
  1. Execute `database/truthlens_schema.sql` on your MySQL server.
  2. Set `DATABASE_URL` environment variable:
     ```bash
     export DATABASE_URL="mysql+pymysql://username:password@localhost:3306/truthlens"
     ```

---

## ⚖️ Security Features
- Password Hashing with PBKDF2/Werkzeug.
- JWT Authentication for API endpoints.
- SQL Injection protection via SQLAlchemy ORM.
- Input validation and XSS protection.
- CORS restricted origins.

---

## 📄 License
Released under the MIT License. Developed for Truth and Media Integrity.
