from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from decimal import Decimal
import uuid
from datetime import datetime
from ..extensions import db
from ..models.order import Order, OrderItem
from ..models.payment import Payment
from ..constants.roles import Roles
from ..utils.permissions import role_required
from ..constants.order_status import OrderStatus
from ..constants.bank_info import BankInfo

order_bp = Blueprint("order", __name__)

@order_bp.route("", methods=["POST"])
@login_required
@role_required(Roles.CUSTOMER)
def place_order():
    data = request.get_json()
    items = data.get("items")

    if not items or len(items) == 0:
        return jsonify({"error": "Cart is empty"}), 400

    try:
        order = Order(
            user_id=current_user.id,
            status=OrderStatus.PENDING,
            total=Decimal("0.00"),
            table_number=data.get("table_number")
        )
        db.session.add(order)
        db.session.flush()  # 🔑 get order.id before commit

        total = Decimal("0.00")

        for item in items:
            price = Decimal(str(item["price"]))
            quantity = int(item["quantity"])

            order_item = OrderItem(
                order_id=order.id,
                product_id=uuid.UUID(item["product_id"]),
                quantity=quantity,
                price=price
            )

            total += price * quantity
            db.session.add(order_item)

        order.total = total
        db.session.commit()

        return jsonify({
            "order_id": str(order.id),
            "total": str(order.total),
            "status": order.status,
            "table_number": order.table_number,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to place order",
            "details": str(e)
        }), 500


@order_bp.route("/payment/qr/<uuid:order_id>", methods=["GET"])
@login_required
@role_required(Roles.CUSTOMER)
def get_payment_qr(order_id):
    order = Order.query.filter_by(
        id=order_id,
        user_id=current_user.id
    ).first_or_404()
    
    # ✅ Check if a Payment already exists for this order
    payment = Payment.query.filter_by(order_id=order.id).first()

    if payment:
        # Reuse the existing payment reference
        payment_reference = payment.payment_reference
    else:
        # Create a new payment if none exists
        payment_reference = f"ORDER-{order.id.hex[:8]}"
        payment = Payment(
            order_id=order.id,
            amount=order.total,
            status=OrderStatus.PENDING.value,
            payment_reference=payment_reference,
        )
        db.session.add(payment)

        # Update order status only if payment is new
        order.status = OrderStatus.WAITING_PAYMENT

        db.session.commit()  # commit both Payment + order status

    return jsonify({
        "order_id": str(order.id),
        "amount": str(order.total),
        "bank": {
            "name": BankInfo.NAME,
            "account_number": BankInfo.ACCOUNT_NUMBER,
            "account_name": BankInfo.ACCOUNT_NAME
        },
        "transfer_content": payment_reference,
        "qr_string": f"VCB|0123456789|{order.total}|{payment_reference}"
    })


@order_bp.route("/<uuid:order_id>/status", methods=["GET"])
@login_required
def get_order_status(order_id):
    # Find the order for this user
    order = Order.query.filter_by(id=order_id).first()
    
    # Return the status as a string
    return jsonify({
        "order_id": str(order.id),
        "status": order.status
    })


@order_bp.route("/<uuid:order_id>", methods=["GET"])
@login_required
def get_order(order_id):
    order = Order.query.filter_by(id=order_id).first_or_404()

    return jsonify({
        "order_id": str(order.id),
        "status": order.status,
        "total": order.total,
        "created_at": order.created_at.isoformat(),
        "table_number": order.table_number,
    })

@order_bp.route("/<uuid:order_id>/items", methods=["GET"])
@login_required
def get_order_items(order_id):
    order = Order.query.filter_by(id=order_id).first_or_404()

    return jsonify({
        "order_id": str(order.id),
        "items": [
            {
                "item_id": str(item.id),
                "product_id": str(item.product_id),
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price": str(item.price),
                "subtotal": str(item.price * item.quantity)
            }
            for item in order.items
        ]
    })



@order_bp.route("/payment/confirm/<uuid:order_id>", methods=["POST"])
@login_required
@role_required(Roles.RESTAURANT)
def confirm_payment(order_id):
    order = Order.query.filter_by(id=order_id).first_or_404()

    if order.status != OrderStatus.WAITING_PAYMENT:
        return jsonify({"error": "Order not ready for confirmation"}), 400

    order.status = OrderStatus.PAID
    order.paid_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Payment confirmed",
        "order_id": str(order.id),
        "status": order.status
    })
