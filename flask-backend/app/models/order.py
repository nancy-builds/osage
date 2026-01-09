import uuid
from datetime import datetime
from ..extensions import db

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("users.id"),
        nullable=False
    )

    status = db.Column(db.String(20), default="pending")
    total = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
