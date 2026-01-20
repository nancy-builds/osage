from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from datetime import datetime
from app.utils.permissions import role_required
from app.constants.roles import Roles
from app.models.reward import Reward
from ..extensions import db

reward_bp = Blueprint("reward", __name__)


@reward_bp.route("", methods=["GET"])
@login_required
def get_all_rewards():
    now = datetime.utcnow()

    rewards = Reward.query.filter(
        Reward.is_active.is_(True),
        (Reward.expires_at.is_(None)) | (Reward.expires_at > now)
    ).order_by(Reward.required_points.asc()).all()

    return jsonify([
        reward.to_dict() for reward in rewards
    ])


@reward_bp.route("/<uuid:reward_id>/redeem", methods=["POST"])
@login_required
@role_required(Roles.CUSTOMER)
def redeem_reward(reward_id):
    reward = Reward.query.get_or_404(reward_id)
    user = current_user

    # ❌ inactive reward
    if not reward.is_active:
        return jsonify({"error": "Reward is not active"}), 400

    # ❌ expired reward
    if reward.expires_at and reward.expires_at < datetime.utcnow():
        return jsonify({"error": "Reward has expired"}), 400

    # ❌ not enough points
    if user.loyalty_points < reward.required_points:
        return jsonify({"error": "Not enough loyalty points"}), 400

    # ❌ already redeemed
    if reward in user.rewards:
        return jsonify({"error": "Reward already redeemed"}), 400

    # ✅ redeem
    user.loyalty_points -= reward.required_points
    user.rewards.append(reward)

    db.session.commit()

    return jsonify({
        "message": "Reward redeemed successfully",
        "remaining_points": user.loyalty_points,
        "reward_id": str(reward.id)
    }), 200
