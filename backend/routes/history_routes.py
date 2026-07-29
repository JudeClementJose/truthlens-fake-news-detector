from flask import Blueprint, request, jsonify
from database import db
from models import Prediction
from auth_utils import optional_token
from datetime import datetime

history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('', methods=['GET'])
@optional_token
def get_history(current_user):
    search_query = request.args.get('query', '').strip()
    category = request.args.get('category', 'All').strip()
    prediction_filter = request.args.get('prediction', 'All').strip() # Real, Fake, All
    start_date_str = request.args.get('start_date', '').strip()
    end_date_str = request.args.get('end_date', '').strip()
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))

    query = Prediction.query

    # Filter by user if logged in, otherwise return public/recent entries
    if current_user:
        query = query.filter_by(user_id=current_user.id)

    # Search filter
    if search_query:
        search_fmt = f"%{search_query}%"
        query = query.filter(
            (Prediction.headline.ilike(search_fmt)) |
            (Prediction.article.ilike(search_fmt))
        )

    # Category filter
    if category and category != 'All':
        query = query.filter(Prediction.category == category)

    # Prediction filter
    if prediction_filter and prediction_filter != 'All':
        query = query.filter(Prediction.prediction == prediction_filter)

    # Date range filters
    if start_date_str:
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            query = query.filter(Prediction.created_at >= start_date)
        except ValueError:
            pass

    if end_date_str:
        try:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
            query = query.filter(Prediction.created_at <= end_date)
        except ValueError:
            pass

    # Order by newest first
    query = query.order_by(Prediction.created_at.desc())

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'items': [item.to_dict() for item in paginated.items],
        'total': paginated.total,
        'page': page,
        'pages': paginated.pages,
        'per_page': per_page
    }), 200

@history_bp.route('/<int:prediction_id>', methods=['GET'])
@optional_token
def get_prediction_detail(current_user, prediction_id):
    prediction = Prediction.query.get(prediction_id)
    if not prediction:
        return jsonify({'message': 'Prediction record not found.'}), 404
        
    return jsonify(prediction.to_dict()), 200

@history_bp.route('/<int:prediction_id>', methods=['DELETE'])
@optional_token
def delete_history_item(current_user, prediction_id):
    prediction = Prediction.query.get(prediction_id)
    if not prediction:
        return jsonify({'message': 'Item not found.'}), 404

    # Permission check
    if current_user and prediction.user_id and prediction.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized to delete this record.'}), 403

    db.session.delete(prediction)
    db.session.commit()
    return jsonify({'message': 'Entry deleted successfully.'}), 200

@history_bp.route('/clear-all', methods=['DELETE'])
@optional_token
def clear_all_history(current_user):
    if current_user:
        Prediction.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        return jsonify({'message': 'All user analysis history cleared.'}), 200
    else:
        return jsonify({'message': 'Authentication required to clear history.'}), 401
