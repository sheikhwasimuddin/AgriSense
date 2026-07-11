import sys
from loguru import logger
import os

# Create logs directory if it doesn't exist
os.makedirs(os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs"), exist_ok=True)

logger.remove()
logger.add(
    sys.stdout, 
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
)
logger.add(
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs", "app.log"), 
    rotation="10 MB", 
    retention="10 days", 
    level="INFO"
)
