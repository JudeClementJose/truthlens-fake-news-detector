import os
import joblib
import numpy as np
from ai_engine.base_classifier import BaseNewsClassifier
from ai_engine.preprocessor import TextPreprocessor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Known sensationalist or clickbait terms for fallback highlight tagging
SENSATIONAL_TERMS = set([
    'shocking', 'unbelievable', 'secret', 'miracle', 'conspiracy', 'illuminati', 
    'banned', 'exposed', 'leaked', 'hoax', 'mind-blowing', 'deepstate', 'alien', 
    'truth', 'cover-up', 'fake', 'rigged', 'mainstream', 'censored', 'doctored',
    'guaranteed', 'breakthrough', 'doctors', 'cure', 'hidden', 'scam'
])

class TFIDFLogisticRegressionClassifier(BaseNewsClassifier):
    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
        self.model = LogisticRegression(C=1.5, max_iter=1000, random_state=42)
        self.is_trained = False

    def train(self, texts, labels):
        """
        texts: list of raw text strings
        labels: list of integers (1 for Fake, 0 for Real)
        """
        cleaned_texts = [self.preprocessor.clean_text(t) for t in texts]
        X = self.vectorizer.fit_transform(cleaned_texts)
        self.model.fit(X, labels)
        self.is_trained = True

    def predict(self, text):
        if not text or len(text.strip()) == 0:
            return {
                'prediction': 'Unknown',
                'confidence': 0.0,
                'risk_level': 'Low',
                'keywords': [],
                'suspicious_words': [],
                'explanation': 'Empty input text provided.'
            }

        cleaned = self.preprocessor.clean_text(text)
        
        if not self.is_trained:
            # Fallback heuristic calculation if model binary is not yet trained
            return self._heuristic_prediction(text, cleaned)

        X = self.vectorizer.transform([cleaned])
        probs = self.model.predict_proba(X)[0] # [prob_real, prob_fake]
        
        prob_fake = float(probs[1]) if len(probs) > 1 else 0.5
        prob_real = float(probs[0]) if len(probs) > 0 else 0.5
        
        is_fake = prob_fake >= 0.5
        confidence = prob_fake * 100.0 if is_fake else prob_real * 100.0
        confidence = round(confidence, 1)

        # Determine risk level based on fake news probability
        if is_fake:
            if confidence >= 80.0:
                risk_level = 'High'
            elif confidence >= 65.0:
                risk_level = 'Medium'
            else:
                risk_level = 'Low'
        else:
            risk_level = 'Low'

        # Extract influential keywords using feature weights
        keywords, suspicious_words = self._extract_influential_keywords(cleaned, text)

        prediction_label = 'Fake' if is_fake else 'Real'
        
        explanation = self._generate_explanation(prediction_label, confidence, risk_level, keywords)

        return {
            'prediction': prediction_label,
            'confidence': confidence,
            'risk_level': risk_level,
            'keywords': keywords,
            'suspicious_words': suspicious_words,
            'explanation': explanation
        }

    def _extract_influential_keywords(self, cleaned_text, raw_text):
        keywords = []
        suspicious_words = []
        
        tokens = cleaned_text.split()
        if not tokens or not hasattr(self.model, 'coef_'):
            return keywords, suspicious_words

        feature_names = self.vectorizer.get_feature_names_out()
        feature_index = {feat: idx for idx, feat in enumerate(feature_names)}
        coefs = self.model.coef_[0]

        word_weights = {}
        for token in tokens:
            if token in feature_index:
                idx = feature_index[token]
                weight = float(coefs[idx]) # Positive weights bias towards Fake
                word_weights[token] = weight

        # Sort tokens by absolute impact weight
        sorted_tokens = sorted(word_weights.items(), key=lambda x: abs(x[1]), reverse=True)
        
        for token, weight in sorted_tokens[:8]:
            impact = 'Fake Indicator' if weight > 0 else 'Real Indicator'
            keywords.append({
                'word': token,
                'weight': round(weight, 3),
                'type': impact
            })
            if weight > 0.2 or token in SENSATIONAL_TERMS:
                suspicious_words.append(token)

        # Fallback check on raw text for sensational terms
        raw_words = re.findall(r'\b\w+\b', raw_text.lower())
        for w in raw_words:
            if w in SENSATIONAL_TERMS and w not in suspicious_words:
                suspicious_words.append(w)

        return keywords, suspicious_words[:10]

    def _heuristic_prediction(self, raw_text, cleaned_text):
        tokens = cleaned_text.split()
        sensational_found = [w for w in tokens if w in SENSATIONAL_TERMS]
        
        ratio = len(sensational_found) / max(len(tokens), 1)
        is_fake = ratio > 0.15 or len(sensational_found) >= 2
        
        confidence = 75.0 if is_fake else 88.0
        risk = 'High' if (is_fake and confidence > 70) else ('Medium' if is_fake else 'Low')
        pred = 'Fake' if is_fake else 'Real'
        
        return {
            'prediction': pred,
            'confidence': confidence,
            'risk_level': risk,
            'keywords': [{'word': w, 'weight': 0.5, 'type': 'Fake Indicator'} for w in sensational_found],
            'suspicious_words': sensational_found,
            'explanation': f"Rule-based heuristic classified text as {pred} due to presence of sensationalist keywords."
        }

    def _generate_explanation(self, prediction, confidence, risk_level, keywords):
        fake_keywords = [k['word'] for k in keywords if k['type'] == 'Fake Indicator']
        real_keywords = [k['word'] for k in keywords if k['type'] == 'Real Indicator']
        
        if prediction == 'Fake':
            exp = f"Our AI NLP engine analyzed the linguistic features and vector representation of this article with a {confidence}% confidence level ({risk_level} Risk). "
            if fake_keywords:
                exp += f"Key suspicious terms influencing this classification include: {', '.join(fake_keywords[:5])}."
            else:
                exp += "The syntax and semantic distribution closely match patterns typically found in sensationalist or unverified reports."
        else:
            exp = f"Our AI model evaluated this news item as Real News with a {confidence}% confidence level ({risk_level} Risk). "
            if real_keywords:
                exp += f"The article exhibits verified journalistic phrasing and trusted terminology such as: {', '.join(real_keywords[:5])}."
            else:
                exp += "The structure and vocabulary align with standard, objective news reportage."
        return exp

    def save_model(self, model_dir):
        os.makedirs(model_dir, exist_ok=True)
        joblib.dump(self.model, os.path.join(model_dir, 'model.pkl'))
        joblib.dump(self.vectorizer, os.path.join(model_dir, 'vectorizer.pkl'))

    def load_model(self, model_dir):
        model_path = os.path.join(model_dir, 'model.pkl')
        vec_path = os.path.join(model_dir, 'vectorizer.pkl')
        if os.path.exists(model_path) and os.path.exists(vec_path):
            self.model = joblib.load(model_path)
            self.vectorizer = joblib.load(vec_path)
            self.is_trained = True
            return True
        return False
