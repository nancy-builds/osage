import uuid
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.dialects.postgresql import UUID
from ..extensions import db

user_rewards = db.Table(
    "user_rewards",
    db.Column("user_id", db.UUID(as_uuid=True), db.ForeignKey("users.id"), primary_key=True),
    db.Column("reward_id", db.UUID(as_uuid=True), db.ForeignKey("rewards.id"), primary_key=True),
    db.Column("redeemed_at", db.DateTime, default=datetime.utcnow),
)

class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    email = db.Column(db.String(120), unique=True, nullable=True)

    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    
    date_of_birth = db.Column(db.Date, nullable=True)  # ✅ DOB

    full_name = db.Column(db.String(100))

    # 🔹 New fields
    avatar_url = db.Column(db.Text, nullable=True)
    membership_level = db.Column(db.String(20), default="basic", nullable=False)
    loyalty_points = db.Column(db.Integer, default=0, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    rewards = db.relationship(
        "Reward",
        secondary=user_rewards,
        back_populates="users"
    )
    

    def get_id(self):
        return str(self.id)  # 🔥 REQUIRED