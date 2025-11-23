from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_session
from app.repositories.activity_repository import get_activities_by_user_id
from app.schemas.activity_schema import ActivityOut
from typing import List

router = APIRouter()

@router.get("/activities/user/{user_id}", response_model=List[ActivityOut])
async def get_activities_for_user(user_id: int, db: AsyncSession = Depends(get_session)):
    activities = await get_activities_by_user_id(user_id, db)
    if not activities:
        raise HTTPException(status_code=404, detail="No activities found for user")
    return activities
