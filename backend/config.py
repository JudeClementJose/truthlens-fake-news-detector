import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Test directory write permission
def is_dir_writable(path):
    try:
        test_file = os.path.join(path, '.write_test')
        with open(test_file, 'w') as f:
            f.write('1')
        os.remove(test_file)
        return True
    except Exception:
        return False

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'truthlens-super-secret-key-2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'truthlens-jwt-secret-key-98765')
    JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 24))
    
    # Determine safe SQLite path
    if os.environ.get('VERCEL') or not is_dir_writable(BASE_DIR):
        default_db_uri = 'sqlite:////tmp/truthlens.db'
        upload_folder = '/tmp/uploads'
    else:
        default_db_uri = f"sqlite:///{os.path.join(BASE_DIR, 'truthlens.db')}"
        upload_folder = os.path.join(BASE_DIR, 'uploads')

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', default_db_uri)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    UPLOAD_FOLDER = upload_folder
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max limit
    ALLOWED_EXTENSIONS = {'txt', 'png', 'jpg', 'jpeg', 'csv'}
    
    MODEL_DIR = os.path.join(BASE_DIR, 'ai_engine', 'saved_models')
    RATE_LIMIT_PER_MINUTE = 60
