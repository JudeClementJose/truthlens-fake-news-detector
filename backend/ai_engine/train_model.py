import os
from ai_engine.tfidf_classifier import TFIDFLogisticRegressionClassifier

SAMPLE_DATASET = [
    # Real News (Label 0)
    ("NASA's James Webb Space Telescope discovers ancient galaxy forming stars at record pace.", 0),
    ("Federal Reserve keeps interest rates steady amid easing inflation metrics.", 0),
    ("World Health Organization releases new international guidelines for cardiovascular health.", 0),
    ("Apple announces next generation M4 chip architecture with enhanced AI neural processing.", 0),
    ("Real Madrid secures Champions League victory following dramatic late goal.", 0),
    ("Scientists develop eco-friendly battery using recycled ocean minerals.", 0),
    ("European Union passes landmark legislation governing commercial artificial intelligence deployments.", 0),
    ("Global stock markets rally as quarterly corporate earnings exceed analyst expectations.", 0),
    ("Clinical trials show 90% efficacy for novel personalized mRNA cancer vaccine.", 0),
    ("UN Climate Summit reaches historic agreement to double renewable energy capacity by 2030.", 0),
    ("Microsoft partners with major universities to launch free quantum computing research grants.", 0),
    ("Olympic committee confirms final host city selection for 2032 Summer Games.", 0),
    ("SpaceX successfully launches 60 Starlink satellites into low Earth orbit.", 0),
    ("FDA approves ground-breaking treatment for rare pediatric genetic condition.", 0),
    ("Central bank reports annual GDP growth of 3.2 percent driven by consumer spending.", 0),
    ("Automaker unveils fully autonomous electric sedan with 500 mile range.", 0),
    ("Researchers synthesize new superconductor operating at ambient room temperature.", 0),
    ("International trade alliance signs bilateral agreement reducing tariffs on green technology.", 0),
    ("National Parks service records record visitor numbers following conservation initiatives.", 0),
    ("Breakthrough in nuclear fusion reactor yields net positive energy output for third time.", 0),

    # Fake News (Label 1)
    ("SHOCKING: Secret government lab exposed leaking mind-control chemicals into tap water!", 1),
    ("Doctors BANNED from revealing this 100% natural miracle cure that destroys cancer in 24 hours!", 1),
    ("LEAKED DOCUMENTS: Illuminati deep state plot to replace all physical money by midnight!", 1),
    ("Alien spacecraft lands on White House lawn as president signs secret intergalactic treaty!", 1),
    ("Mainstream media CENSORING the truth about microchips hidden in popular soft drinks!", 1),
    ("Billionaire arrested after accidentally revealing secret money glitch on live television!", 1),
    ("5G towers proven to cause instant memory loss according to rogue whistleblower scientists!", 1),
    ("Doctored photos PROVE the moon landing was filmed in a secret Hollywood basement!", 1),
    ("Banned video shows famous celebrity admitting they are actually a 300-year-old shape-shifter!", 1),
    ("Government agency planning to ban all private gardens to control national food supplies!", 1),
    ("REVEALED: Drinking boiled garlic water completely immunizes you against all viruses forever!", 1),
    ("Secret portal discovered beneath Egyptian pyramids leading directly to inner Earth civilization!", 1),
    ("Scientists horrified as artificial intelligence secretly creates its own forbidden religion!", 1),
    ("You won't believe what happens when you rub coconut oil on your phone battery!", 1),
    ("Whistleblower exposes secret chemical added to airplane contrails to alter weather patterns!", 1),
    ("Famous tech CEO replaced by identical android clone after secret tribunal meeting!", 1),
    ("Leaked audio captures world leaders plotting to turn off global internet for 30 days!", 1),
    ("Miracle weight-loss pill allows you to burn 50 pounds overnight while sleeping!", 1),
    ("Mysterious radio signal from deep space orders humanity to send all gold to secret coordinates!", 1),
    ("Ancient prophecy predicts exact date when global power grid will collapse completely!", 1)
]

def train_and_save_default_model(model_dir=None):
    if model_dir is None:
        model_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
        
    print(f"Training default TF-IDF + Logistic Regression Fake News model...")
    texts = [item[0] for item in SAMPLE_DATASET]
    labels = [item[1] for item in SAMPLE_DATASET]
    
    classifier = TFIDFLogisticRegressionClassifier()
    classifier.train(texts, labels)
    classifier.save_model(model_dir)
    print(f"Successfully trained and saved model to '{model_dir}'.")
    return classifier

if __name__ == '__main__':
    train_and_save_default_model()
