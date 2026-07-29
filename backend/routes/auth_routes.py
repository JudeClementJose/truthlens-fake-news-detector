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
    try:
        db.create_all()  # Ensure database tables exist in serverless memory
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
            
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
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
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        db.create_all()  # Guarantee database tables exist in serverless memory
        data = request.get_json() or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required.'}), 400
            
        user = User.query.filter_by(email=email).first()

        # On-demand auto-provisioning for Jude Clement Jose Admin
        if email == 'judeclmentjose4@gmail.com':
            if not user:
                user = User(
                    name="Jude Clement Jose",
                    email="judeclmentjose4@gmail.com",
                    role="admin"
                )
                user.set_password("a 446633")
                db.session.add(user)
                db.session.commit()
            else:
                user.role = "admin"
                user.set_password("a 446633")
                db.session.commit()

        # On-demand auto-provisioning for System Admin
        elif email == 'admin@truthlens.ai':
            if not user:
                user = User(name="System Admin", email="admin@truthlens.ai", role="admin")
                user.set_password("Admin@12345")
                db.session.add(user)
                db.session.commit()

        # On-demand auto-provisioning for Demo User
        elif email == 'demo@truthlens.ai':
            if not user:
                user = User(name="Demo Researcher", email="demo@truthlens.ai", role="user")
                user.set_password("Demo@12345")
                db.session.add(user)
                db.session.commit()
        
        password_valid = user.check_password(password) if user else False
        
        # Flexibility check for Jude's password with or without spaces
        if not password_valid and user and email == 'judeclmentjose4@gmail.com':
            if password in ['a 446633', 'a446633']:
                password_valid = True
                
        if not user or not password_valid:
            return jsonify({'message': 'Invalid email or password.'}), 401
            
        token = generate_jwt(user.id, user.role)
        
        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'message': f'Login error: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
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
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Profile update failed: {str(e)}'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    
    if not email or not validate_email(email):
        return jsonify({'message': 'Please provide a valid email address.'}), 400
        
    return jsonify({
        'message': 'If an account with that email exists, password reset instructions have been sent.'
    }), 200
