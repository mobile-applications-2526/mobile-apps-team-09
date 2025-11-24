from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base

class ActivityType(enum.Enum):
    PLANT_ADDED = "plant_added"
    DIAGNOSIS = "diagnosis"
    WATERED = "watered"

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=True)
    diagnosis_id = Column(Integer, ForeignKey("diagnoses.id"), nullable=True)
    activity_type = Column(Enum(ActivityType, values_callable=lambda x: [e.name for e in x]), nullable=False)
    title = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="activities")
    plant = relationship("Plant", back_populates="activities")
    diagnosis = relationship("Diagnosis", back_populates="activities")

# Add back_populates to User and Plant models:
# User.activities = relationship("Activity", back_populates="user")
# Plant.activities = relationship("Activity", back_populates="plant")
