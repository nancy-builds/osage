from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "Pending"
    WAITING_PAYMENT = "Waiting for Payment"
    PAID = "Paid"
    CANCELLED = "Cancelled"
