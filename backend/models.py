from datetime import datetime
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    predictions = db.relationship('Prediction', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Prediction(db.Model):
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    headline = db.Column(db.Text, nullable=True)
    article = db.Column(db.Text, nullable=False)
    prediction = db.Column(db.String(20), nullable=False)  # 'Real' or 'Fake'
    confidence = db.Column(db.Float, nullable=False)  # e.g., 94.5
    risk_level = db.Column(db.String(20), default='Low')  # 'Low', 'Medium', 'High'
    category = db.Column(db.String(50), default='General')  # Politics, Technology, etc.
    keywords_json = db.Column(db.Text, nullable=True)  # JSON string of suspicious/important words
    explanation = db.Column(db.Text, nullable=True)
    processing_time_ms = db.Column(db.Float, default=0.0)
    source_type = db.Column(db.String(20), default='text')  # text, file, ocr, voice
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        keywords = []
        if self.keywords_json:
            try:
                keywords = json.loads(self.keywords_json)
            except Exception:
                keywords = []

        return {
            'id': self.id,
            'user_id': self.user_id,
            'headline': self.headline or '',
            'article': self.article,
            'prediction': self.prediction,
            'confidence': self.confidence,
            'risk_level': self.risk_level,
            'category': self.category,
            'keywords': keywords,
            'explanation': self.explanation or '',
            'processing_time_ms': self.processing_time_ms,
            'source_type': self.source_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Dataset(db.Model):
    __tablename__ = 'datasets'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    sample_count = db.Column(db.Integer, default=0)
    uploaded_by = db.Column(db.String(100), default='Admin')
    status = db.Column(db.String(50), default='Uploaded')  # Uploaded, Processing, Trained
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'sample_count': self.sample_count,
            'uploaded_by': self.uploaded_by,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
