from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_active_user
from db import crud, schemas, models
from core.logger import logger

router = APIRouter()

@router.post("/", response_model=schemas.Farm)
async def create_farm(
    farm: schemas.FarmCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return await crud.create_farm(db=db, farm=farm, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Farm])
async def read_farms(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return await crud.get_farms(db=db, user_id=current_user.id)

@router.get("/{farm_id}", response_model=schemas.Farm)
async def read_farm(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    farm = await crud.get_farm(db=db, farm_id=farm_id)
    if farm is None or farm.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm

@router.delete("/{farm_id}")
async def delete_farm_endpoint(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    farm = await crud.get_farm(db=db, farm_id=farm_id)
    if farm is None or farm.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    await crud.delete_farm(db=db, farm_id=farm_id)
    return {"message": "Farm deleted successfully"}
