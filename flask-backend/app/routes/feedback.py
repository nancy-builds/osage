from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..constants.roles import Roles
from ..utils.permissions import role_required
from ..extensions import db
from ..models.feedback import Feedback
from ..models.order import Order
from ..constants.order_status import OrderStatus
import uuid
from decimal import Decimal

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/<uuid:order_id>", methods=["POST"])
@login_required
@role_required(Roles.CUSTOMER)
def submit_feedback(order_id):
    order = Order.query.get_or_404(order_id)

    # 1️⃣ Only owner can feedback
    if order.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    # 2️⃣ Only COMPLETED orders (assuming PAID means still processing)
    if order.status != OrderStatus.COMPLETED.value:
        return jsonify({"message": "Order not completed yet"}), 400

    # 3️⃣ Prevent duplicate feedback
    existing = Feedback.query.filter_by(order_id=order.id).first()
    if existing:
        return jsonify({"message": "Feedback already submitted"}), 409

    data = request.get_json() or {}

    feedback = Feedback(
        order_id=order.id,
        user_id=current_user.id,
        rating=data.get("rating"),
        comment=data.get("comment")
    )

    # 🔥 Loyalty points logic
    total = Decimal(order.total_amount)

    if total >= Decimal("50"):
        multiplier = Decimal("1.5")
    elif total >= Decimal("20"):
        multiplier = Decimal("1.2")
    else:
        multiplier = Decimal("1.0")

    points_earned = int(total * multiplier)

    if current_user.loyalty_points is None:
        current_user.loyalty_points = 0

    current_user.loyalty_points += points_earned
    order.points_earned = points_earned

    db.session.add(feedback)
    db.session.commit()

    return jsonify({
        "message": "Feedback submitted successfully",
        "points_earned": points_earned,
        "total_loyalty_points": current_user.loyalty_points
    }), 201
