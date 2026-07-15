import httpx
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_active_user
from db import crud, models

router = APIRouter()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "YOUR_OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"

@router.get("/{farm_id}")
async def get_weather(
    farm_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    farm = await crud.get_farm(db, farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    async with httpx.AsyncClient() as client:
        # Current weather
        current_resp = await client.get(
            f"{BASE_URL}/weather",
            params={
                "lat": farm.latitude,
                "lon": farm.longitude,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
        )
        if current_resp.status_code != 200:
            raise HTTPException(status_code=502, detail="Weather API error")
        
        # 5-day forecast
        forecast_resp = await client.get(
            f"{BASE_URL}/forecast",
            params={
                "lat": farm.latitude,
                "lon": farm.longitude,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
        )
        
        current_data = current_resp.json()
        forecast_data = forecast_resp.json() if forecast_resp.status_code == 200 else {"list": []}
        
        # Process forecast into daily summaries
        daily_forecast = []
        seen_dates = set()
        for item in forecast_data.get("list", []):
            date = item["dt_txt"].split(" ")[0]
            if date not in seen_dates and len(daily_forecast) < 5:
                seen_dates.add(date)
                daily_forecast.append({
                    "date": date,
                    "temp_min": item["main"]["temp_min"],
                    "temp_max": item["main"]["temp_max"],
                    "humidity": item["main"]["humidity"],
                    "description": item["weather"][0]["description"],
                    "icon": item["weather"][0]["icon"],
                    "wind_speed": item["wind"]["speed"]
                })
        
        return {
            "farm_name": farm.farm_name,
            "location": farm.location,
            "current": {
                "temp": current_data["main"]["temp"],
                "feels_like": current_data["main"]["feels_like"],
                "humidity": current_data["main"]["humidity"],
                "pressure": current_data["main"]["pressure"],
                "wind_speed": current_data["wind"]["speed"],
                "description": current_data["weather"][0]["description"],
                "icon": current_data["weather"][0]["icon"],
                "clouds": current_data.get("clouds", {}).get("all", 0),
                "visibility": current_data.get("visibility", 10000)
            },
            "forecast": daily_forecast
        }
