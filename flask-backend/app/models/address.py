import uuid
from ..extensions import db

class Address(db.Model):
    __tablename__ = "addresses"

    id = db.Column(
        db.UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("users.id"),
        nullable=False
    )

    address_line = db.Column(db.Text, nullable=False)
    city = db.Column(db.String)
    country = db.Column(db.String)
    is_default = db.Column(db.Boolean, default=False)
