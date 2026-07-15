from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriSense AI API"
    SUPABASE_URL: str = "https://your-project-ref.supabase.co"
    SUPABASE_ANON_KEY: str = "your-anon-key"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@db.your-project-ref.supabase.co:5432/postgres"
    JWT_SECRET_KEY: str = "your_jwt_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OPENROUTER_API_KEY: str = "YOUR_OPENROUTER_API_KEY"
    OPENWEATHER_API_KEY: str = "YOUR_OPENWEATHER_API_KEY"
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
