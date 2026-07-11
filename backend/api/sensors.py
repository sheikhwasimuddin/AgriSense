from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from core.security import get_current_active_user
from db import crud, schemas, models

router = APIRouter()

@router.post("/upload", response_model=schemas.SensorData)
async def upload_sensor_data(
    sensor_data: schemas.SensorDataCreate,
    db: AsyncSession = Depends(get_db)
    # Note: ESP32 might use a simpler token or API key for IoT endpoints
    # but keeping it simple for now without hard requirements.
):
    # Ensure farm exists
    farm = await crud.get_farm(db, farm_id=sensor_data.farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    return await crud.create_sensor_data(db, sensor_data)

@router.get("/latest", response_model=schemas.SensorData)
async def get_latest_reading(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    farm = await crud.get_farm(db, farm_id)
    if not farm or farm.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    data = await crud.get_latest_sensor_data(db, farm_id)
    if not data:
        raise HTTPException(status_code=404, detail="No sensor data found")
    return data

@router.get("/history/{farm_id}", response_model=List[schemas.SensorData])
async def get_sensor_history(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    farm = await crud.get_farm(db, farm_id)
    if not farm or farm.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    result = await db.execute(
        select(models.SensorData)
        .filter(models.SensorData.farm_id == farm_id)
        .order_by(models.SensorData.timestamp.desc())
        .limit(100) # last 100 readings
    )
    return result.scalars().all()
