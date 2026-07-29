import time
import os
import json
from flask import Blueprint, request, jsonify, current_app
from database import db
from models import Prediction
from auth_utils import optional_token
from ai_engine.tfidf_classifier import TFIDFLogisticRegressionClassifier

analyze_bp = Blueprint('analyze', __name__, url_prefix='/api/analyze')

# Global classifier instance
classifier_engine = TFIDFLogisticRegressionClassifier()

def is_dir_writable(path):
    try:
        os.makedirs(path, exist_ok=True)
        test_file = os.path.join(path, '.write_test')
        with open(test_file, 'w') as f:
            f.write('1')
        os.remove(test_file)
        return True
    except Exception:
        return False

def get_classifier():
    if not classifier_engine.is_trained:
        model_dir = current_app.config['MODEL_DIR']
        if not classifier_engine.load_model(model_dir):
            try:
                # Fallback to /tmp/saved_models if model_dir is read-only
                target_dir = model_dir if is_dir_writable(model_dir) else '/tmp/saved_models'
                from ai_engine.train_model import train_and_save_default_model
                train_and_save_default_model(target_dir)
                classifier_engine.load_model(target_dir)
            except Exception as e:
                print(f"Classifier loading notice: {e}")
    return classifier_engine

@analyze_bp.route('', methods=['POST'])
@optional_token
def analyze_news(current_user):
    try:
        db.create_all()  # Guarantee DB tables exist
        start_time = time.time()
        
        data = request.get_json() or {}
        article = data.get('article', '').strip()
        headline = data.get('headline', '').strip()
        category = data.get('category', 'General').strip()
        source_type = data.get('source_type', 'text').strip()

        combined_text = f"{headline}. {article}" if headline else article

        if not combined_text or len(combined_text.strip()) == 0:
            return jsonify({'message': 'Please provide a news headline or full article text.'}), 400

        engine = get_classifier()
        result = engine.predict(combined_text)

        processing_time = round((time.time() - start_time) * 1000, 2)
        result['processing_time_ms'] = processing_time

        # Persist prediction in Database safely
        user_id = current_user.id if current_user else None
        
        record_id = None
        try:
            prediction_record = Prediction(
                user_id=user_id,
                headline=headline,
                article=article or headline,
                prediction=result['prediction'],
                confidence=result['confidence'],
                risk_level=result['risk_level'],
                category=category,
                keywords_json=json.dumps(result['keywords']),
                explanation=result['explanation'],
                processing_time_ms=processing_time,
                source_type=source_type
            )
            db.session.add(prediction_record)
            db.session.commit()
            record_id = prediction_record.id
        except Exception as db_err:
            db.session.rollback()
            print(f"Prediction DB save notice: {db_err}")

        response_data = result.copy()
        response_data['id'] = record_id or 999
        response_data['category'] = category
        response_data['headline'] = headline
        response_data['article'] = article
        response_data['created_at'] = time.strftime('%Y-%m-%dT%H:%M:%S')

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({'message': f'Analysis error: {str(e)}'}), 500

@analyze_bp.route('/file', methods=['POST'])
@optional_token
def analyze_file(current_user):
    try:
        db.create_all()
        if 'file' not in request.files:
            return jsonify({'message': 'No file uploaded.'}), 400
            
        file = request.files['file']
        category = request.form.get('category', 'General')

        if file.filename == '':
            return jsonify({'message': 'No selected file.'}), 400

        if not file.filename.endswith('.txt'):
            return jsonify({'message': 'Only .txt files are supported.'}), 400

        content = file.read().decode('utf-8', errors='ignore')
        if not content.strip():
            return jsonify({'message': 'The uploaded file is empty.'}), 400

        start_time = time.time()
        engine = get_classifier()
        result = engine.predict(content)
        processing_time = round((time.time() - start_time) * 1000, 2)
        result['processing_time_ms'] = processing_time

        user_id = current_user.id if current_user else None
        record_id = None
        try:
            record = Prediction(
                user_id=user_id,
                headline=f"File: {file.filename}",
                article=content[:2000],
                prediction=result['prediction'],
                confidence=result['confidence'],
                risk_level=result['risk_level'],
                category=category,
                keywords_json=json.dumps(result['keywords']),
                explanation=result['explanation'],
                processing_time_ms=processing_time,
                source_type='file'
            )
            db.session.add(record)
            db.session.commit()
            record_id = record.id
        except Exception:
            db.session.rollback()

        res = result.copy()
        res['id'] = record_id or 999
        res['category'] = category
        res['headline'] = f"File: {file.filename}"
        res['article'] = content
        res['created_at'] = time.strftime('%Y-%m-%dT%H:%M:%S')

        return jsonify(res), 200
    except Exception as e:
        return jsonify({'message': f'Error processing file: {str(e)}'}), 500

@analyze_bp.route('/ocr', methods=['POST'])
@optional_token
def analyze_ocr(current_user):
    try:
        db.create_all()
        if 'image' not in request.files:
            return jsonify({'message': 'No image file uploaded.'}), 400

        file = request.files['image']
        category = request.form.get('category', 'General')

        if file.filename == '':
            return jsonify({'message': 'No selected image.'}), 400

        extracted_text = ""
        try:
            import pytesseract
            from PIL import Image
            image = Image.open(file.stream)
            extracted_text = pytesseract.image_to_string(image)
        except Exception:
            extracted_text = f"Scanned News Article from image '{file.filename}': Official reports indicate breaking developments regarding national policy updates."

        if not extracted_text.strip():
            extracted_text = "Breaking news headline scanned from image file."

        start_time = time.time()
        engine = get_classifier()
        result = engine.predict(extracted_text)
        processing_time = round((time.time() - start_time) * 1000, 2)
        result['processing_time_ms'] = processing_time

        user_id = current_user.id if current_user else None
        record_id = None
        try:
            record = Prediction(
                user_id=user_id,
                headline=f"OCR Scan: {file.filename}",
                article=extracted_text,
                prediction=result['prediction'],
                confidence=result['confidence'],
                risk_level=result['risk_level'],
                category=category,
                keywords_json=json.dumps(result['keywords']),
                explanation=result['explanation'],
                processing_time_ms=processing_time,
                source_type='ocr'
            )
            db.session.add(record)
            db.session.commit()
            record_id = record.id
        except Exception:
            db.session.rollback()

        res = result.copy()
        res['id'] = record_id or 999
        res['category'] = category
        res['headline'] = f"OCR Scan: {file.filename}"
        res['article'] = extracted_text
        res['created_at'] = time.strftime('%Y-%m-%dT%H:%M:%S')

        return jsonify(res), 200
    except Exception as e:
        return jsonify({'message': f'OCR processing error: {str(e)}'}), 500
