from datetime import datetime
from uuid import uuid4

from ..extensions import db

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    restaurant_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("restaurants.id"), nullable=False)
    status = db.Column(db.String, default="pending")
    total = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship("OrderItem", backref="orders", cascade="all, delete")


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid4)
    order_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("orders.id"), nullable=False)
    menu_item_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("menu_items.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
