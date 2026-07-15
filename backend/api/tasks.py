from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from core.database import get_db
from core.security import get_current_active_user
from db import crud, schemas, models

router = APIRouter()

@router.get("/", response_model=List[schemas.CropTask])
async def get_tasks(
    current_user: models.User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await crud.get_crop_tasks(db, current_user.id)

@router.post("/", response_model=schemas.CropTask, status_code=201)
async def create_task(
    task: schemas.CropTaskCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await crud.create_crop_task(db, task, current_user.id)

@router.put("/{task_id}", response_model=schemas.CropTask)
async def update_task(
    task_id: int,
    task_update: schemas.CropTaskUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    updated = await crud.update_crop_task(db, task_id, task_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@router.patch("/{task_id}/toggle", response_model=schemas.CropTask)
async def toggle_task(
    task_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    toggled = await crud.toggle_crop_task(db, task_id)
    if not toggled:
        raise HTTPException(status_code=404, detail="Task not found")
    return toggled

@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    deleted = await crud.delete_crop_task(db, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
