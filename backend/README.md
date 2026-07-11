# AgriSense AI - Backend

Production-ready FastAPI backend for AgriSense AI integrating IoT sensor data, Farm Management, and Machine Learning Crop Yield Prediction.

## Features
- **Supabase Integration**: PostgreSQL via asyncpg.
- **Authentication**: JWT & RBAC (Farmer, Admin, Agricultural Officer).
- **Machine Learning**: Loads Joblib ML models into memory automatically on application startup.
- **IoT Sensors**: Endpoint for ESP32 devices to push environmental data.
- **Analytics**: Farm-specific sensor analytics.

## Setup
1. Duplicate `.env.example` to `.env` and fill in your Supabase details.
2. Install dependencies: `pip install -r requirements.txt`
3. Generate Alembic migrations:
   ```bash
   alembic init db/migrations
   # Edit alembic.ini and env.py for your models
   alembic revision --autogenerate -m "Initial schema"
   alembic upgrade head
   ```
4. Run server:
   ```bash
   uvicorn main:app --reload
   ```
5. View API docs at `http://localhost:8000/docs`.

## Docker Deployment
```bash
docker build -t agrisense-backend .
docker run -p 8000:8000 --env-file .env agrisense-backend
```
