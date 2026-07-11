import os
import joblib
import pandas as pd
from core.logger import logger
from db.schemas import YieldPredictionRequest

class PredictorService:
    def __init__(self):
        self.model = None
        self.pipeline = None
        
    def load_models(self):
        logger.info("Loading ML models into memory...")
        base_dir = os.path.dirname(os.path.abspath(__file__))
        pipeline_path = os.path.join(base_dir, "pipeline.pkl")
        
        if not os.path.exists(pipeline_path):
            logger.error(f"Pipeline not found at {pipeline_path}. Ensure models are trained and copied.")
            return
            
        try:
            self.pipeline = joblib.load(pipeline_path)
            logger.info("ML models loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading models: {e}")

    def predict_yield(self, data: YieldPredictionRequest) -> float:
        if self.pipeline is None:
            raise RuntimeError("Models are not loaded.")
            
        input_df = pd.DataFrame([{
            'Area': data.Area,
            'Item': data.Item,
            'Year': data.Year,
            'average_rain_fall_mm_per_year': data.average_rain_fall_mm_per_year,
            'avg_temp': data.avg_temp,
            'pesticides_tonnes': data.pesticides_tonnes
        }])
        
        prediction = self.pipeline.predict(input_df)
        return float(prediction[0])

predictor_service = PredictorService()
