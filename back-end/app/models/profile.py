"""
Profile database model
"""
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.db.database import Base


class Profile(Base):
    """
    Profile model representing user profiles in the system
    """

    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    tagline = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    living_situation = Column(String(255), nullable=True)
    experience_level = Column(String(100), nullable=True)
    experience_years = Column(Integer, nullable=True)
    plant_count = Column(Integer, default=0, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to User model
    user = relationship("User", backref="profile")

    def __repr__(self):
        return f"<Profile(id={self.id}, user_id={self.user_id}, full_name={self.full_name})>"
