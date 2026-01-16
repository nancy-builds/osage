from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "PENDING"
    WAITING_PAYMENT = "WAITING_PAYMENT"
    PAID = "PAID"
    CANCELLED = "CANCELLED"
