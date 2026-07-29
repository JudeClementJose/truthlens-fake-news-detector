from abc import ABC, abstractmethod

class BaseNewsClassifier(ABC):
    """
    Abstract Base Class for News Classifiers.
    Enables seamless plug-and-play swapping between TF-IDF + Logistic Regression,
    BERT, RoBERTa, or other transformer-based AI models without modifying
    backend API endpoints or frontend clients.
    """
    
    @abstractmethod
    def train(self, texts, labels):
        """Train the classifier on a list of texts and binary/categorical labels."""
        pass
        
    @abstractmethod
    def predict(self, text):
        """
        Analyze input news text and return structured prediction results.
        
        Must return a dict formatted as:
        {
            'prediction': 'Real' or 'Fake',
            'confidence': float (0.0 to 100.0),
            'risk_level': 'Low', 'Medium', or 'High',
            'keywords': list of strings/dicts with impact score,
            'suspicious_words': list of suspicious words found in text,
            'explanation': str detailed reasoning
        }
        """
        pass

    @abstractmethod
    def save_model(self, model_dir):
        """Persist model artifacts to disk."""
        pass

    @abstractmethod
    def load_model(self, model_dir):
        """Load model artifacts from disk."""
        pass
