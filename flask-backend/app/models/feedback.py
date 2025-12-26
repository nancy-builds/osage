import uuid
from datetime import datetime
from uuid import uuid4

from ..extensions import db

class Feedback(db.Model):
    __tablename__ = "feedbacks"

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

    restaurant_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("restaurants.id"),
        nullable=False
    )
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
