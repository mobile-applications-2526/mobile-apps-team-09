from app.models.activity import Activity, ActivityType
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

async def get_activities_by_user_id(user_id: int, db: AsyncSession) -> List[Activity]:
    result = await db.execute(
        select(Activity).where(Activity.user_id == user_id).order_by(Activity.created_at.desc())
    )
    return result.scalars().all()

# Example usage:
# activities = get_activities_by_user_id(user_id, db)
