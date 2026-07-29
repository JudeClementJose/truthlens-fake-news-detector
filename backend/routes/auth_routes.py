from flask import Blueprint, request, jsonify
from database import db
from models import User
from auth_utils import generate_jwt, token_required
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not name or not email or not password:
        return jsonify({'message': 'Name, email, and password are required.'}), 400
        
    if not validate_email(email):
        return jsonify({'message': 'Invalid email address format.'}), 400
        
    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters long.'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'An account with this email already exists.'}), 409
        
    user = User(name=name, email=email, role='user')
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    token = generate_jwt(user.id, user.role)
    
    return jsonify({
        'message': 'Registration successful!',
        'token': token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password.'}), 401
        
    token = generate_jwt(user.id, user.role)
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    new_password = data.get('new_password', '')
    
    if name:
        current_user.name = name
        
    if new_password:
        if len(new_password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters long.'}), 400
        current_user.set_password(new_password)
        
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully!',
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    
    if not email or not validate_email(email):
        return jsonify({'message': 'Please provide a valid email address.'}), 400
        
    user = User.query.filter_by(email=email).first()
    # Security practice: do not leak whether user exists
    return jsonify({
        'message': 'If an account with that email exists, password reset instructions have been sent.'
    }), 200
