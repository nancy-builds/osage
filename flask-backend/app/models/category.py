import uuid
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), nullable=False, unique=True)

    products = db.relationship(
        "Product",
        backref="category",
        cascade="all, delete-orphan"
    )
