import uuid
from datetime import datetime
from ..extensions import db

class Feedback(db.Model):
    __tablename__ = "feedbacks"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    order_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("orders.id"),
        nullable=False,
        unique=True  # đảm bảo mỗi order chỉ có 1 feedback
    )
    
    user_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("users.id"),
        nullable=False
    )

    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    order = db.relationship("Order", back_populates="feedback")
    