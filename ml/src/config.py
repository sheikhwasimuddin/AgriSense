import os

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'yield_df.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'models')
PLOTS_DIR = os.path.join(BASE_DIR, 'outputs', 'plots')
EVALUATION_DIR = os.path.join(BASE_DIR, 'outputs', 'evaluation')

# Features
TARGET = 'hg/ha_yield'
CATEGORICAL_FEATURES = ['Area', 'Item']
NUMERICAL_FEATURES = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp']
DROP_COLUMNS = ['Unnamed: 0']

# Modeling
RANDOM_STATE = 42
TEST_SIZE = 0.2
