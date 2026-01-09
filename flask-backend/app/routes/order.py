from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..extensions import db
from ..models.order import Order, OrderItem
from ..constants.roles import Roles
from ..utils.permissions import role_required
from decimal import Decimal
import uuid

order_bp = Blueprint("order", __name__)

@order_bp.route("", methods=["POST", "OPTIONS"], strict_slashes=False)
@login_required
@role_required(Roles.CUSTOMER)
def place_order():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()
    items = data.get("items")
    if not items:
        return jsonify({"error": "Cart is empty"}), 400

    try:
        order = Order(
            user_id=current_user.id,
            status="pending",
            total=Decimal("0.00")
        )
        db.session.add(order)
        db.session.flush()  # ✅ CRITICAL

        total = Decimal("0.00")

        for item in items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=uuid.UUID(item["product_id"]),  # ✅ FIXED
                quantity=item["quantity"],
                price=Decimal(str(item["price"]))
            )

            total += order_item.price * order_item.quantity
            db.session.add(order_item)

        order.total = total
        db.session.commit()

        return jsonify({
            "message": "Order placed successfully",
            "order_id": str(order.id),
            "total": str(order.total)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to place order",
            "details": str(e)
        }), 500
