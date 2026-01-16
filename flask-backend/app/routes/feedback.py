from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..extensions import db
from ..models.feedback import Feedback
from ..models.order import Order
from ..constants.order_status import OrderStatus
import uuid

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/<uuid:order_id>", methods=["POST"])
@login_required
def submit_feedback(order_id):
    order = Order.query.get_or_404(order_id)

    # 1️⃣ Only owner can feedback
    if order.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    # 2️⃣ Only PAID orders
    if order.status != OrderStatus.PAID.value:
        return jsonify({"message": "Order not completed yet"}), 400

    # 3️⃣ Prevent duplicate feedback
    existing = Feedback.query.filter_by(order_id=order.id).first()
    if existing:
        return jsonify({"message": "Feedback already submitted"}), 409

    data = request.get_json()

    feedback = Feedback(
        order_id=order.id,
        user_id=current_user.id,
        rating=data.get("rating"),
        comment=data.get("comment")
    )

    db.session.add(feedback)
    db.session.commit()

    return jsonify({
        "message": "Feedback submitted successfully",
        "feedback_id": str(feedback.id)
    }), 201


