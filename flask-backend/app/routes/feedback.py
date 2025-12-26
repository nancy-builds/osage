from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
from uuid import uuid4

from ..utils.helper import is_customer
from ..extensions import db
from ..models.feedback import Feedback

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("", methods=["POST"])
@login_required
def create_feedback():
    if not is_customer():
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    restaurant_id = data.get("restaurant_id")
    rating = data.get("rating")
    comment = data.get("comment")

    if not restaurant_id or not rating:
        return jsonify({"message": "restaurant_id and rating are required"}), 400

    feedback = Feedback(
        id=str(uuid4()),
        user_id=str(current_user.id),
        restaurant_id=restaurant_id,
        rating=rating,
        comment=comment,
        created_at=datetime.utcnow(),
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully"}), 201

@feedback_bp.route("", methods=["GET"])
@login_required
def get_all_feedback():
    feedbacks = Feedback.query.order_by(Feedback.created_at.desc()).all()
    return jsonify([
        {
            "id": f.id,
            "user_id": f.user_id,
            "restaurant_id": f.restaurant_id,
            "rating": f.rating,
            "comment": f.comment,
            "created_at": f.created_at.isoformat(),
            "is_owner": f.user_id == str(current_user.id)
        }
        for f in feedbacks
    ])

@feedback_bp.route("/me", methods=["GET"])
@login_required
def get_my_feedback():
    if not is_customer():
        return jsonify({"message": "Only customers can view feedback"}), 403

    feedbacks = Feedback.query.filter_by(
        user_id=str(current_user.id)
    ).order_by(Feedback.created_at.desc()).all()

    return jsonify([
        {
            "id": f.id,
            "restaurant_id": f.restaurant_id,
            "rating": f.rating,
            "comment": f.comment,
            "created_at": f.created_at.isoformat(),
        }
        for f in feedbacks
    ])

@feedback_bp.route("/<feedback_id>", methods=["PUT"])
@login_required
def update_feedback(feedback_id):
    feedback = Feedback.query.get_or_404(feedback_id)

    if feedback.user_id != str(current_user.id):
        return jsonify({"message": "You can only edit your own feedback"}), 403

    data = request.get_json()
    feedback.rating = data.get("rating", feedback.rating)
    feedback.comment = data.get("comment", feedback.comment)

    db.session.commit()

    return jsonify({"message": "Feedback updated successfully"})

@feedback_bp.route("/<feedback_id>", methods=["DELETE"])
@login_required
def delete_feedback(feedback_id):
    if not is_customer():
        return jsonify({"message": "Only customers can delete feedback"}), 403

    feedback = Feedback.query.get_or_404(feedback_id)

    if feedback.user_id != str(current_user.id):
        return jsonify({"message": "You can only delete your own feedback"}), 403

    db.session.delete(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback deleted successfully"})

