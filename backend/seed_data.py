import json
from database import db
from models import User, Prediction, Admin, Dataset
from werkzeug.security import generate_password_hash

SAMPLE_PREDICTIONS_SEED = [
    {
        'headline': "Scientists discover revolutionary ocean clean-up microbe capable of breaking down plastics.",
        'article': "Researchers from the Global Oceanography Institute have identified a bacterium species capable of consuming PET microplastics 10 times faster than prior enzymes.",
        'prediction': "Real",
        'confidence': 96.4,
        'risk_level': "Low",
        'category': "Science",
        'keywords': [{'word': 'researchers', 'weight': -0.4, 'type': 'Real Indicator'}, {'word': 'microbe', 'weight': -0.3, 'type': 'Real Indicator'}],
        'explanation': "The text demonstrates rigorous academic phrasing and verifiable scientific terminology."
    },
    {
        'headline': "SHOCKING: Secret lab leaks chemical that controls human thoughts through wireless signals!",
        'article': "Whistleblowers reveal secret government facility exposing citizens to experimental cognitive control frequencies.",
        'prediction': "Fake",
        'confidence': 98.2,
        'risk_level': "High",
        'category': "Politics",
        'keywords': [{'word': 'shocking', 'weight': 0.8, 'type': 'Fake Indicator'}, {'word': 'whistleblowers', 'weight': 0.5, 'type': 'Fake Indicator'}],
        'explanation': "Sensationalist language, unverified conspiracy claims, and emotional trigger words detected."
    },
    {
        'headline': "Federal Reserve announces interest rate policy shift to support sustainable growth.",
        'article': "The central bank indicated a moderate rate cut strategy following quarterly inflation reports meeting targeted benchmarks.",
        'prediction': "Real",
        'confidence': 94.1,
        'risk_level': "Low",
        'category': "Business",
        'keywords': [{'word': 'bank', 'weight': -0.5, 'type': 'Real Indicator'}, {'word': 'inflation', 'weight': -0.4, 'type': 'Real Indicator'}],
        'explanation': "Aligns with official financial reports and institutional communication standards."
    },
    {
        'headline': "Miracle plant extract cures all known chronic diseases in 48 hours according to banned doctor!",
        'article': "Big Pharma is attempting to ban this simple household herb that eliminates high blood pressure and diabetes overnight.",
        'prediction': "Fake",
        'confidence': 95.7,
        'risk_level': "High",
        'category': "Health",
        'keywords': [{'word': 'miracle', 'weight': 0.9, 'type': 'Fake Indicator'}, {'word': 'banned', 'weight': 0.7, 'type': 'Fake Indicator'}],
        'explanation': "Medical misinformation characteristics identified: sensational health claims lacking peer-reviewed trial evidence."
    },
    {
        'headline': "Next-generation electric vehicle battery achieves 1,000 km range on single 10-minute charge.",
        'article': "Automotive tech startup demonstrates solid-state battery prototype validated by independent testing laboratories.",
        'prediction': "Real",
        'confidence': 91.8,
        'risk_level': "Low",
        'category': "Technology",
        'keywords': [{'word': 'prototype', 'weight': -0.3, 'type': 'Real Indicator'}, {'word': 'validated', 'weight': -0.4, 'type': 'Real Indicator'}],
        'explanation': "Balanced technical report referencing independent validation labs."
    },
    {
        'headline': "Alien fleet spotted behind lunar orbit by amateur astronomer with binocular lenses!",
        'article': "Classified space command satellite images allegedly intercepted showing glowing alien motherships preparing for contact.",
        'prediction': "Fake",
        'confidence': 99.1,
        'risk_level': "High",
        'category': "Science",
        'keywords': [{'word': 'alien', 'weight': 0.95, 'type': 'Fake Indicator'}, {'word': 'intercepted', 'weight': 0.6, 'type': 'Fake Indicator'}],
        'explanation': "Extremely improbable astronomical claims unsupported by observational observatory telemetry."
    }
]

def seed_initial_data():
    # Check if admin exists
    admin_user = User.query.filter_by(email='admin@truthlens.ai').first()
    if not admin_user:
        admin_user = User(
            name="System Admin",
            email="admin@truthlens.ai",
            role="admin"
        )
        admin_user.set_password("Admin@12345")
        db.session.add(admin_user)

    # Check standard demo user
    demo_user = User.query.filter_by(email='demo@truthlens.ai').first()
    if not demo_user:
        demo_user = User(
            name="Demo Researcher",
            email="demo@truthlens.ai",
            role="user"
        )
        demo_user.set_password("Demo@12345")
        db.session.add(demo_user)

    db.session.commit()

    # Seed sample predictions if table is empty
    if Prediction.query.count() == 0:
        for p in SAMPLE_PREDICTIONS_SEED:
            rec = Prediction(
                user_id=demo_user.id,
                headline=p['headline'],
                article=p['article'],
                prediction=p['prediction'],
                confidence=p['confidence'],
                risk_level=p['risk_level'],
                category=p['category'],
                keywords_json=json.dumps(p['keywords']),
                explanation=p['explanation'],
                processing_time_ms=120.5,
                source_type='text'
            )
            db.session.add(rec)
        db.session.commit()
        print("Database seeded with sample demo predictions.")

    # Seed sample dataset record
    if Dataset.query.count() == 0:
        ds = Dataset(
            filename="sample_fake_news_corpus_2026.csv",
            sample_count=40,
            uploaded_by="System Admin",
            status="Trained"
        )
        db.session.add(ds)
        db.session.commit()
