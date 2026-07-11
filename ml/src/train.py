import os
import sys
import json
# Add the project root (ml folder) to sys.path to allow running the script directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import (RandomForestRegressor, ExtraTreesRegressor, 
                              GradientBoostingRegressor, AdaBoostRegressor)
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from lightgbm import LGBMRegressor

import src.config as config
from src.utils import setup_logger, save_model
from src.preprocess import load_and_clean_data, build_preprocessor
from src.evaluate import evaluate_model, create_comparison_table

logger = setup_logger('agrisense.train')

def get_models():
    """Returns a dictionary of models to train."""
    return {
        'Linear Regression': LinearRegression(),
        'Ridge Regression': Ridge(random_state=config.RANDOM_STATE),
        'Lasso Regression': Lasso(random_state=config.RANDOM_STATE),
        'Decision Tree': DecisionTreeRegressor(random_state=config.RANDOM_STATE),
        'Random Forest': RandomForestRegressor(random_state=config.RANDOM_STATE),
        'Extra Trees': ExtraTreesRegressor(random_state=config.RANDOM_STATE),
        'Gradient Boosting': GradientBoostingRegressor(random_state=config.RANDOM_STATE),
        'AdaBoost': AdaBoostRegressor(random_state=config.RANDOM_STATE),
        'XGBoost': XGBRegressor(random_state=config.RANDOM_STATE, n_jobs=-1),
        'CatBoost': CatBoostRegressor(random_state=config.RANDOM_STATE, verbose=0),
        'LightGBM': LGBMRegressor(random_state=config.RANDOM_STATE, n_jobs=-1, verbose=-1)
    }

def get_tuning_params():
    """Returns hyperparameter grids for tuning."""
    return {
        'Random Forest': {
            'regressor__n_estimators': [50, 100, 200],
            'regressor__max_depth': [None, 10, 20],
            'regressor__min_samples_split': [2, 5, 10]
        },
        'XGBoost': {
            'regressor__n_estimators': [100, 200, 300],
            'regressor__learning_rate': [0.01, 0.05, 0.1],
            'regressor__max_depth': [3, 5, 7]
        },
        'CatBoost': {
            'regressor__iterations': [100, 200, 300],
            'regressor__learning_rate': [0.01, 0.05, 0.1],
            'regressor__depth': [4, 6, 8]
        },
        'LightGBM': {
            'regressor__n_estimators': [100, 200, 300],
            'regressor__learning_rate': [0.01, 0.05, 0.1],
            'regressor__num_leaves': [31, 50, 100]
        }
    }

def main():
    logger.info("Starting training pipeline...")
    
    # 1. Load Data
    df = load_and_clean_data(config.DATA_PATH)
    
    # 2. Split Data
    X = df.drop(columns=[config.TARGET])
    y = df[config.TARGET]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=config.TEST_SIZE, random_state=config.RANDOM_STATE
    )
    logger.info(f"Train set size: {X_train.shape[0]}, Test set size: {X_test.shape[0]}")
    
    # 3. Build Preprocessor
    preprocessor = build_preprocessor()
    
    # Save preprocessor
    save_model(preprocessor, os.path.join(config.MODEL_DIR, 'preprocessor.pkl'))
    
    # 4. Train Models
    models = get_models()
    params = get_tuning_params()
    
    metrics_list = []
    trained_pipelines = {}
    
    for name, model in models.items():
        logger.info(f"=== Training {name} ===")
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', model)
        ])
        
        # Check if model needs tuning
        if name in params:
            logger.info(f"Performing Hyperparameter Tuning for {name}...")
            search = RandomizedSearchCV(
                pipeline, 
                param_distributions=params[name], 
                n_iter=5, # Reduced iterations for faster execution during setup, increase for prod
                cv=5, 
                scoring='r2', 
                n_jobs=-1, 
                random_state=config.RANDOM_STATE
            )
            search.fit(X_train, y_train)
            best_pipeline = search.best_estimator_
            logger.info(f"Best parameters for {name}: {search.best_params_}")
            pipeline = best_pipeline
        else:
            pipeline.fit(X_train, y_train)
            
        trained_pipelines[name] = pipeline
        
        # 5. Evaluate Model
        metrics = evaluate_model(pipeline, name, X_train, y_train, X_test, y_test)
        metrics_list.append(metrics)
        logger.info(f"{name} R2 Score: {metrics['R2 Score']:.4f}")

    # 6. Compare and Save Best Model
    comparison_df = create_comparison_table(metrics_list)
    best_model_name = comparison_df.iloc[0]['Model']
    best_pipeline = trained_pipelines[best_model_name]
    
    logger.info(f"Best Model Selected: {best_model_name} with R2 = {comparison_df.iloc[0]['R2 Score']:.4f}")
    
    save_model(best_pipeline.named_steps['regressor'], os.path.join(config.MODEL_DIR, 'best_model.pkl'))
    save_model(best_pipeline, os.path.join(config.MODEL_DIR, 'pipeline.pkl'))
    
    logger.info("Training pipeline completed successfully.")

if __name__ == "__main__":
    main()
