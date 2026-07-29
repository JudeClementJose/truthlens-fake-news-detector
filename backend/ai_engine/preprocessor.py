import re
import string
import os

DEFAULT_STOPWORDS = set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
    'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
    'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
    'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
    'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
    'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
    'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t',
    'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
    'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t',
    'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why',
    'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your',
    'yours', 'yourself', 'yourselves'
])

class TextPreprocessor:
    def __init__(self):
        self.stopwords = DEFAULT_STOPWORDS
        self.lemmatizer = None
        self._init_nltk()

    def _init_nltk(self):
        try:
            import nltk
            
            # Configure /tmp/nltk_data for serverless platforms like Vercel
            tmp_nltk = '/tmp/nltk_data'
            if tmp_nltk not in nltk.data.path:
                nltk.data.path.append(tmp_nltk)

            try:
                nltk.data.find('corpora/stopwords')
            except LookupError:
                try:
                    os.makedirs(tmp_nltk, exist_ok=True)
                    nltk.download('stopwords', download_dir=tmp_nltk, quiet=True)
                except Exception:
                    pass

            try:
                nltk.data.find('corpora/wordnet')
            except LookupError:
                try:
                    os.makedirs(tmp_nltk, exist_ok=True)
                    nltk.download('wordnet', download_dir=tmp_nltk, quiet=True)
                except Exception:
                    pass

            from nltk.corpus import stopwords
            from nltk.stem import WordNetLemmatizer
            
            self.stopwords = set(stopwords.words('english'))
            self.lemmatizer = WordNetLemmatizer()
        except Exception:
            self.stopwords = DEFAULT_STOPWORDS
            self.lemmatizer = None

    def clean_text(self, text):
        if not text or not isinstance(text, str):
            return ""

        text = text.lower()
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        text = re.sub(r'<.*?>', '', text)
        text = re.sub(r'\d+', '', text)
        text = text.translate(str.maketrans('', '', string.punctuation))

        tokens = text.split()

        cleaned_tokens = []
        for token in tokens:
            if token not in self.stopwords and len(token) > 2:
                if self.lemmatizer:
                    try:
                        token = self.lemmatizer.lemmatize(token)
                    except Exception:
                        pass
                cleaned_tokens.append(token)

        return " ".join(cleaned_tokens)

    def extract_tokens(self, text):
        cleaned = self.clean_text(text)
        return cleaned.split()
