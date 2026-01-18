import uuid
from datetime import datetime
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    category_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("categories.id"),
        nullable=False
    )

    name = db.Column(db.String(100), nullable=False)
    name_japanese = db.Column(db.String(100))
    description = db.Column(db.Text)

    price = db.Column(db.Numeric(10, 2), nullable=False)

    vegetarian = db.Column(db.Boolean, default=False)
    spicy = db.Column(db.Integer)  # 1–5
    image_url = db.Column(db.String(255))

    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
