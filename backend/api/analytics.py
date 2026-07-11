from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from core.database import get_db
from core.security import get_current_active_user
from db import models

router = APIRouter()

@router.get("/{farm_id}/summary")
async def get_analytics_summary(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Verify ownership
    result = await db.execute(select(models.Farm).filter(models.Farm.id == farm_id))
    farm = result.scalars().first()
    if not farm or farm.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Farm not found")

    # Aggregate sensor data
    result = await db.execute(
        select(
            func.avg(models.SensorData.temperature).label("avg_temp"),
            func.avg(models.SensorData.humidity).label("avg_hum"),
            func.avg(models.SensorData.soil_moisture).label("avg_soil")
        ).filter(models.SensorData.farm_id == farm_id)
    )
    averages = result.fetchone()
    
    # Get latest prediction
    result_pred = await db.execute(
        select(models.YieldPrediction)
        .filter(models.YieldPrediction.farm_id == farm_id)
        .order_by(models.YieldPrediction.created_at.desc())
        .limit(1)
    )
    latest_pred = result_pred.scalars().first()

    return {
        "farm_id": farm_id,
        "averages": {
            "temperature": round(averages.avg_temp, 2) if averages.avg_temp else 0,
            "humidity": round(averages.avg_hum, 2) if averages.avg_hum else 0,
            "soil_moisture": round(averages.avg_soil, 2) if averages.avg_soil else 0
        },
        "latest_prediction": latest_pred.predicted_yield if latest_pred else None
    }
