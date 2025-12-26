from uuid import uuid4

from ..extensions import db

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid4)
    order_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("orders.id"), nullable=False)
    method = db.Column(db.String)
    status = db.Column(db.String)
    paid_at = db.Column(db.DateTime)
