import uuid
from datetime import datetime
from ..extensions import db
from ..constants.order_status import OrderStatus

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    order_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey("orders.id"),
        nullable=False
    )
    
    payment_reference = db.Column(db.String(50), unique=True, nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    status = db.Column(db.String(20), default=OrderStatus.PENDING.value)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    paid_at = db.Column(db.DateTime, nullable=True)

