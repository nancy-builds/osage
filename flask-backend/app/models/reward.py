import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from ..extensions import db


class Reward(db.Model):
    __tablename__ = "rewards"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    required_points = db.Column(db.Integer, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=True)  # NULL = never expires
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    users = db.relationship(
        "User",
        secondary="user_rewards",
        back_populates="rewards"
    )
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "required_points": self.required_points,
            "image_url": self.image_url,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "is_active": self.is_active,
        }
