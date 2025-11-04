"""
Plant database model
"""


from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.database import Base

class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    plant_name = Column(String(100), nullable=False)
    location = Column(String(255), nullable=True)
    last_watered = Column(DateTime(timezone=True), nullable=True)
    image_url = Column(String(500), nullable=True)

    # relationships
    owner = relationship("User", back_populates="plants")
