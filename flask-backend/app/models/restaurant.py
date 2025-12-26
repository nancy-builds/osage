import uuid
from datetime import datetime
from uuid import uuid4

from ..extensions import db

class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(
        db.UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid4)
    restaurant_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("restaurants.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
