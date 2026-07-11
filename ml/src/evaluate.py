import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.model_selection import cross_val_score
import src.config as config
from src.utils import setup_logger

logger = setup_logger('agrisense.evaluate')

def evaluate_model(model, model_name, X_train, y_train, X_test, y_test):
    """Evaluates a model and returns metrics."""
    logger.info(f"Evaluating {model_name}...")
    
    y_pred = model.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    
    # Calculate CV score (using 5 folds on training data)
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2', n_jobs=-1)
    cv_mean = np.mean(cv_scores)
    
    metrics = {
        'Model': model_name,
        'R2 Score': r2,
        'MAE': mae,
        'MSE': mse,
        'RMSE': rmse,
        'CV R2 Mean': cv_mean
    }
    
    # Generate Evaluation Plots
    generate_evaluation_plots(y_test, y_pred, model, model_name)
    
    return metrics

def generate_evaluation_plots(y_test, y_pred, model, model_name):
    """Generates evaluation plots for the model."""
    safe_name = model_name.replace(" ", "_").lower()
    
    # 1. Prediction vs Actual Plot
    plt.figure(figsize=(8, 6))
    plt.scatter(y_test, y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Yield')
    plt.ylabel('Predicted Yield')
    plt.title(f'{model_name} - Prediction vs Actual')
    plt.tight_layout()
    plt.savefig(os.path.join(config.EVALUATION_DIR, f'{safe_name}_pred_vs_actual.png'))
    plt.close()
    
    # 2. Residual Plot
    residuals = y_test - y_pred
    plt.figure(figsize=(8, 6))
    plt.scatter(y_pred, residuals, alpha=0.5)
    plt.hlines(0, xmin=y_pred.min(), xmax=y_pred.max(), colors='r', linestyles='--')
    plt.xlabel('Predicted Yield')
    plt.ylabel('Residuals')
    plt.title(f'{model_name} - Residual Plot')
    plt.tight_layout()
    plt.savefig(os.path.join(config.EVALUATION_DIR, f'{safe_name}_residuals.png'))
    plt.close()
    
    # 3. Error Distribution
    plt.figure(figsize=(8, 6))
    sns.histplot(residuals, kde=True)
    plt.xlabel('Error')
    plt.title(f'{model_name} - Error Distribution')
    plt.tight_layout()
    plt.savefig(os.path.join(config.EVALUATION_DIR, f'{safe_name}_error_dist.png'))
    plt.close()
    
    # 4. Feature Importance (if applicable)
    try:
        if hasattr(model, 'named_steps'):
            regressor = model.named_steps['regressor']
            preprocessor = model.named_steps['preprocessor']
            if hasattr(regressor, 'feature_importances_'):
                importances = regressor.feature_importances_
                
                # Get feature names from preprocessor
                cat_encoder = preprocessor.named_transformers_['cat'].named_steps['onehot']
                cat_features = cat_encoder.get_feature_names_out(config.CATEGORICAL_FEATURES)
                feature_names = np.concatenate([config.NUMERICAL_FEATURES, cat_features])
                
                # Plot top 20
                indices = np.argsort(importances)[-20:]
                plt.figure(figsize=(10, 8))
                plt.barh(range(len(indices)), importances[indices], align='center')
                plt.yticks(range(len(indices)), [feature_names[i] for i in indices])
                plt.xlabel('Relative Importance')
                plt.title(f'{model_name} - Feature Importances')
                plt.tight_layout()
                plt.savefig(os.path.join(config.EVALUATION_DIR, f'{safe_name}_feature_importance.png'))
                plt.close()
    except Exception as e:
        logger.warning(f"Could not generate feature importance for {model_name}: {e}")

def create_comparison_table(metrics_list):
    """Creates a comparison table of all models."""
    df = pd.DataFrame(metrics_list)
    df = df.sort_values(by='R2 Score', ascending=False).reset_index(drop=True)
    logger.info("Model Comparison Table:")
    logger.info("\n" + df.to_string())
    df.to_csv(os.path.join(config.EVALUATION_DIR, 'model_comparison.csv'), index=False)
    return df
