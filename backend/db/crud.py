from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db import models, schemas
from uuid import UUID

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(models.User).filter(models.User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(db: AsyncSession, db_user: models.User, user_update: schemas.UserUpdate):
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_farms(db: AsyncSession, user_id: UUID):
    result = await db.execute(select(models.Farm).filter(models.Farm.user_id == user_id))
    return result.scalars().all()

async def get_farm(db: AsyncSession, farm_id: int):
    result = await db.execute(select(models.Farm).filter(models.Farm.id == farm_id))
    return result.scalars().first()

async def create_farm(db: AsyncSession, farm: schemas.FarmCreate, user_id: UUID):
    db_farm = models.Farm(**farm.model_dump(), user_id=user_id)
    db.add(db_farm)
    await db.commit()
    await db.refresh(db_farm)
    return db_farm

async def delete_farm(db: AsyncSession, farm_id: int):
    farm = await get_farm(db, farm_id)
    if farm:
        await db.delete(farm)
        await db.commit()
        return True
    return False

async def create_sensor_data(db: AsyncSession, sensor_data: schemas.SensorDataCreate):
    db_sensor = models.SensorData(**sensor_data.model_dump())
    db.add(db_sensor)
    await db.commit()
    await db.refresh(db_sensor)
    return db_sensor

async def get_latest_sensor_data(db: AsyncSession, farm_id: int):
    result = await db.execute(
        select(models.SensorData)
        .filter(models.SensorData.farm_id == farm_id)
        .order_by(models.SensorData.timestamp.desc())
        .limit(1)
    )
    return result.scalars().first()

async def create_yield_prediction(db: AsyncSession, farm_id: int, request: schemas.YieldPredictionRequest, prediction: float):
    db_pred = models.YieldPrediction(
        farm_id=farm_id,
        crop=request.Item,
        year=request.Year,
        rainfall=request.average_rain_fall_mm_per_year,
        temperature=request.avg_temp,
        pesticides=request.pesticides_tonnes,
        predicted_yield=prediction
    )
    db.add(db_pred)
    await db.commit()
    await db.refresh(db_pred)
    return db_pred

async def get_yield_predictions(db: AsyncSession, farm_id: int):
    result = await db.execute(
        select(models.YieldPrediction)
        .filter(models.YieldPrediction.farm_id == farm_id)
        .order_by(models.YieldPrediction.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()

async def create_disease_prediction(db: AsyncSession, farm_id: int, image_url: str, disease: str, confidence: float, recommendation: str):
    db_pred = models.DiseasePrediction(
        farm_id=farm_id,
        image_url=image_url,
        disease=disease,
        confidence=confidence,
        recommendation=recommendation
    )
    db.add(db_pred)
    await db.commit()
    await db.refresh(db_pred)
    return db_pred

async def get_disease_predictions(db: AsyncSession, farm_id: int):
    result = await db.execute(
        select(models.DiseasePrediction)
        .filter(models.DiseasePrediction.farm_id == farm_id)
        .order_by(models.DiseasePrediction.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()

async def get_crop_tasks(db: AsyncSession, user_id: UUID):
    result = await db.execute(
        select(models.CropTask)
        .filter(models.CropTask.user_id == user_id)
        .order_by(models.CropTask.due_date.asc().nullslast())
    )
    return result.scalars().all()

async def create_crop_task(db: AsyncSession, task: schemas.CropTaskCreate, user_id: UUID):
    db_task = models.CropTask(**task.model_dump(), user_id=user_id)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def update_crop_task(db: AsyncSession, task_id: int, task_update: schemas.CropTaskUpdate):
    result = await db.execute(select(models.CropTask).filter(models.CropTask.id == task_id))
    db_task = result.scalars().first()
    if not db_task:
        return None
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def delete_crop_task(db: AsyncSession, task_id: int):
    result = await db.execute(select(models.CropTask).filter(models.CropTask.id == task_id))
    db_task = result.scalars().first()
    if db_task:
        await db.delete(db_task)
        await db.commit()
        return True
    return False

async def toggle_crop_task(db: AsyncSession, task_id: int):
    result = await db.execute(select(models.CropTask).filter(models.CropTask.id == task_id))
    db_task = result.scalars().first()
    if db_task:
        db_task.completed = not db_task.completed
        db.add(db_task)
        await db.commit()
        await db.refresh(db_task)
        return db_task
    return None
