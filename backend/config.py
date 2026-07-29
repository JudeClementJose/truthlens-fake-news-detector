import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'truthlens-super-secret-key-2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'truthlens-jwt-secret-key-98765')
    JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 24))
    
    # Database configuration (defaults to SQLite, easily switched to MySQL via DB_URI or ENV)
    # MySQL Example: mysql+pymysql://username:password@localhost/truthlens
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        f"sqlite:///{os.path.join(BASE_DIR, 'truthlens.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # File upload configurations
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max limit
    ALLOWED_EXTENSIONS = {'txt', 'png', 'jpg', 'jpeg', 'csv'}
    
    # AI Model path
    MODEL_DIR = os.path.join(BASE_DIR, 'ai_engine', 'saved_models')
    
    # Rate Limiting & Security Defaults
    RATE_LIMIT_PER_MINUTE = 60
