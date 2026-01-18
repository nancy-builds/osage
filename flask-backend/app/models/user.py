import uuid
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.dialects.postgresql import UUID
from ..extensions import db

class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)

    full_name = db.Column(db.String(100))

    # 🔹 New fields
    avatar_url = db.Column(db.Text, nullable=True)
    membership_level = db.Column(db.String(20), default="basic", nullable=False)
    loyalty_points = db.Column(db.Integer, default=0, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_id(self):
        return str(self.id)  # 🔥 REQUIRED