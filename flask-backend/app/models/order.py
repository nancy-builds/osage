import uuid
from datetime import datetime
from ..extensions import db
from ..constants.order_status import OrderStatus
from sqlalchemy.dialects.postgresql import UUID

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("users.id"),
        nullable=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default=OrderStatus.PENDING.value
    )
    
    total = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    table_number = db.Column(db.Integer, nullable=True)

    feedback = db.relationship("Feedback", back_populates="order")
    points_earned = db.Column(db.Integer, default=0)


    items = db.relationship(
        "OrderItem",
        backref="order",
        cascade="all, delete-orphan"
    )


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    order_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("orders.id"),
        nullable=False
    )

    product_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("products.id"),
        nullable=False
    )

    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    product = db.relationship("Product")

