import logging
import joblib
import os
import sys

def setup_logger(name='agrisense', level=logging.INFO):
    """Sets up a logger for the project."""
    logger = logging.getLogger(name)
    if not logger.hasHandlers():
        logger.setLevel(level)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        
        # Console Handler
        ch = logging.StreamHandler(sys.stdout)
        ch.setFormatter(formatter)
        logger.addHandler(ch)
        
    return logger

def save_model(model, filepath):
    """Saves a model using joblib."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    joblib.dump(model, filepath)
    logging.getLogger('agrisense').info(f'Model saved to {filepath}')

def load_model(filepath):
    """Loads a model using joblib."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f'Model file not found: {filepath}')
    model = joblib.load(filepath)
    logging.getLogger('agrisense').info(f'Model loaded from {filepath}')
    return model
