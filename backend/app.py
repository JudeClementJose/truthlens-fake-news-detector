import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db, db
from routes.auth_routes import auth_bp
from routes.analyze_routes import analyze_bp
from routes.history_routes import history_bp
from routes.stats_routes import stats_bp
from routes.admin_routes import admin_bp
from seed_data import seed_initial_data

def create_app():
    app = Flask(__name__, static_folder='uploads')
    app.config.from_object(Config)

    # Enable CORS for frontend Vite application
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize Database
    init_db(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(analyze_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(admin_bp)

    # Seed demo data within app context
    with app.app_context():
        seed_initial_data()

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'app': 'TruthLens AI Backend',
            'version': '1.0.0'
        }), 200

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Endpoint not found.'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'message': 'Internal server error occurred.'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    print("TruthLens AI Flask Backend running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
