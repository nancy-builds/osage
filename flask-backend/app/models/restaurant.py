import uuid
from datetime import datetime
from ..extensions import db

class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
