import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
import src.config as config
from src.utils import setup_logger

logger = setup_logger('agrisense.preprocess')

def load_and_clean_data(filepath):
    """Loads dataset and performs basic cleaning."""
    logger.info(f"Loading data from {filepath}")
    df = pd.read_csv(filepath)
    
    # Drop irrelevant columns
    for col in config.DROP_COLUMNS:
        if col in df.columns:
            df = df.drop(columns=[col])
            logger.info(f"Dropped column: {col}")
            
    # Handle missing values (if any)
    initial_shape = df.shape
    df = df.dropna()  # simple drop, or impute if preferred
    if df.shape[0] < initial_shape[0]:
        logger.info(f"Dropped {initial_shape[0] - df.shape[0]} rows with missing values.")
        
    # Drop duplicates
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        df = df.drop_duplicates()
        logger.info(f"Dropped {duplicates} duplicate rows.")
        
    logger.info(f"Data shape after cleaning: {df.shape}")
    return df

def build_preprocessor():
    """Builds and returns the Scikit-learn preprocessing pipeline."""
    logger.info("Building preprocessing pipeline...")
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, config.NUMERICAL_FEATURES),
            ('cat', categorical_transformer, config.CATEGORICAL_FEATURES)
        ])
    
    logger.info("Preprocessing pipeline built.")
    return preprocessor
