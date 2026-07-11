# AgriSense AI - Crop Yield Prediction Module

## Project Overview
AgriSense AI is a machine learning pipeline designed to predict agricultural crop yield based on various environmental and agricultural factors such as rainfall, temperature, and pesticide usage. This project provides an end-to-end modular solution leveraging Scikit-learn for data preprocessing, training, and evaluation. It implements multiple regression algorithms (Linear, Tree-based, and Boosting models) and automatically selects the best performing model.

## Dataset Description
The dataset contains historical agricultural data:
- `Area`: The country or geographical region.
- `Item`: The type of crop (e.g., Wheat, Rice, Potatoes).
- `Year`: The year of record.
- `average_rain_fall_mm_per_year`: Annual rainfall in mm.
- `pesticides_tonnes`: Amount of pesticides used in tonnes.
- `avg_temp`: Average temperature in Celsius.
- `hg/ha_yield`: Crop yield measured in hectograms per hectare (Target Variable).

## Folder Structure
```text
ml/
├── data/
│   └── yield_df.csv
├── notebooks/
│   └── eda.ipynb
├── src/
│   ├── preprocess.py
│   ├── train.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── utils.py
│   └── config.py
├── models/
│   ├── best_model.pkl
│   ├── preprocessor.pkl
│   └── pipeline.pkl
├── outputs/
│   ├── plots/
│   └── evaluation/
├── requirements.txt
└── README.md
```

## Installation
1. Clone this repository or navigate to the `ml/` directory.
2. Ensure you have Python 3.8+ installed.
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Training Steps
The training pipeline handles data cleaning, preprocessing, model training, hyperparameter tuning, and evaluation.
To train all models and find the best one, run:
```bash
python src/train.py
```
This script will:
- Load and clean the data.
- Split data into 80% train and 20% test sets.
- Build a Scikit-learn preprocessing pipeline.
- Train 11 different models and perform hyperparameter tuning using RandomizedSearchCV.
- Save the `best_model.pkl`, `preprocessor.pkl`, and `pipeline.pkl` into the `models/` directory.

## Prediction Steps
You can use the trained pipeline to predict crop yield for new inputs:
```bash
python src/predict.py --Area "India" --Crop "Wheat" --Year 2026 --Rainfall 1000 --Temperature 25 --Pesticides 120
```

## Model Comparison and Evaluation Metrics
The evaluation script computes the following metrics for every model:
- **R² Score**
- **Mean Absolute Error (MAE)**
- **Mean Squared Error (MSE)**
- **Root Mean Squared Error (RMSE)**
- **Cross Validation Score (CV R2)**

Plots such as Residuals, Prediction vs Actual, Error Distribution, and Feature Importance are saved in `outputs/evaluation/`.
A comparison table `model_comparison.csv` is also generated and saved.

## Future Improvements
- **FastAPI Integration**: Wrap the prediction script in a FastAPI application for REST API access.
- **IoT Integration**: Integrate live weather and soil sensor data to replace static inputs.
- **Deep Learning**: Experiment with neural networks for complex non-linear pattern recognition.
- **Advanced Imputation**: Use iterative imputer or KNN imputer for missing values.
