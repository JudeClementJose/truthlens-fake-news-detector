import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from models import User

def generate_jwt(user_id, role='user'):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=current_app.config['JWT_EXPIRATION_HOURS']),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
    return token

def decode_jwt(token):
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {'error': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Authentication token missing'}), 401
            
        decoded = decode_jwt(token)
        if 'error' in decoded:
            return jsonify({'message': decoded['error']}), 401
            
        current_user = User.query.get(decoded['user_id'])
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

def optional_token(f):
    """Allows authenticated or anonymous access."""
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            decoded = decode_jwt(token)
            if 'error' not in decoded and 'user_id' in decoded:
                current_user = User.query.get(decoded['user_id'])
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({'message': 'Admin authentication token missing'}), 401
            
        decoded = decode_jwt(token)
        if 'error' in decoded:
            return jsonify({'message': decoded['error']}), 401
            
        if decoded.get('role') != 'admin':
            return jsonify({'message': 'Admin privileges required'}), 403
            
        current_user = User.query.get(decoded['user_id'])
        if not current_user or current_user.role != 'admin':
            return jsonify({'message': 'Admin user not found or unauthorized'}), 403
            
        return f(current_user, *args, **kwargs)
    return decorated
