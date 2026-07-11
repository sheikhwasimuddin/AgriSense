import argparse
import sys
import os
# Add the project root (ml folder) to sys.path to allow running the script directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
from src.utils import load_model, setup_logger
import src.config as config
import os

logger = setup_logger('agrisense.predict')

def predict_yield(area, crop, year, rainfall, temperature, pesticides):
    """Predicts crop yield based on input features."""
    pipeline_path = os.path.join(config.MODEL_DIR, 'pipeline.pkl')
    
    try:
        pipeline = load_model(pipeline_path)
    except FileNotFoundError:
        logger.error(f"Pipeline not found at {pipeline_path}. Please train the model first.")
        return None
        
    input_data = pd.DataFrame([{
        'Area': area,
        'Item': crop,
        'Year': year,
        'average_rain_fall_mm_per_year': rainfall,
        'avg_temp': temperature,
        'pesticides_tonnes': pesticides
    }])
    
    logger.info(f"Input data: \n{input_data.to_string(index=False)}")
    
    prediction = pipeline.predict(input_data)
    
    logger.info(f"Predicted Yield (hg/ha): {prediction[0]:.2f}")
    return prediction[0]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict Crop Yield")
    parser.add_argument("--Area", type=str, required=True, help="Country/Area name")
    parser.add_argument("--Crop", type=str, required=True, help="Crop/Item name")
    parser.add_argument("--Year", type=int, required=True, help="Year")
    parser.add_argument("--Rainfall", type=float, required=True, help="Average rainfall (mm/year)")
    parser.add_argument("--Temperature", type=float, required=True, help="Average temperature (Celsius)")
    parser.add_argument("--Pesticides", type=float, required=True, help="Pesticides (tonnes)")
    
    args = parser.parse_args()
    
    predict_yield(
        area=args.Area,
        crop=args.Crop,
        year=args.Year,
        rainfall=args.Rainfall,
        temperature=args.Temperature,
        pesticides=args.Pesticides
    )
