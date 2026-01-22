import uuid
from datetime import datetime
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID

class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.Text, nullable=True)
    phone = db.Column(db.String(20), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

