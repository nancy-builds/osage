from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, current_user, logout_user
from ..extensions import db, login_manager
from ..models.user import User
import uuid
from datetime import datetime
from ..constants.roles import Roles
from ..utils.permissions import role_required
from seeds.seed_menu import seed_menu
from seeds.seed_reward import seed_rewards

auth_bp = Blueprint("auth", __name__)

@login_manager.user_loader
def load_user(user_id):
    try:
        return User.query.get(uuid.UUID(user_id))
    except Exception:
        return None



# @auth_bp.route("/seed", methods=["GET"])
# def seed_all():
#     try:
#         seed_menu()
#         seed_rewards()
#         db.session.commit()
#         return jsonify({"message": "🌱 Seeding completed"}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500



@auth_bp.post("/register")
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Invalid JSON"}), 400

        phone = data.get("phone")
        password = data.get("password")
        role = data.get("role")
        full_name = data.get("full_name")

        if not phone or not password or not role:
            return jsonify({"message": "Missing required fields"}), 400

        if role not in ["customer", "restaurant"]:
            return jsonify({"message": "Invalid role"}), 400

        if User.query.filter_by(phone=phone).first():
            return jsonify({"message": "Phone already registered"}), 409

        password_hash = generate_password_hash(password)

        user = User(
            phone=phone,
            password_hash=password_hash,
            role=role,
            full_name=full_name
        )

        db.session.add(user)
        db.session.flush()  # 🔥 get user.id before commit

        db.session.commit()

        return jsonify({
            "message": "Registered successfully",
            "user": {
                "id": str(user.id),
                "phone": user.phone,
                "role": user.role,
                "full_name": user.full_name
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"message": "Invalid JSON body"}), 400

    phone = data.get("phone", "").strip()
    password = data.get("password", "")

    if not phone or not password:
        return jsonify({
            "message": "Phone and password are required"
        }), 400

    user = User.query.filter_by(phone=phone).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({
            "message": "Invalid phone or password"
        }), 401

    login_user(user, remember=True)

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": str(user.id),
            "phone": user.phone,
            "role": user.role,
            "full_name": user.full_name,
        }
    }), 200


@auth_bp.get("/profile")
@login_required
def profile():
    user = current_user     
    return jsonify({
        "id": str(user.id),
        "phone": user.phone,
        "role": user.role,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "membership_level": user.membership_level,
        "loyalty_points": user.loyalty_points,
        
        "rewards": [
            {
                "id": str(reward.id),
                "name": reward.name,
                "required_points": reward.required_points,
                "expires_at": reward.expires_at.isoformat() if reward.expires_at else None
            }
            for reward in user.rewards
        ],

        "created_at": user.created_at,

    }), 200


@auth_bp.put("/profile-info")
@login_required
def update_profile():
    data = request.get_json()

    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    # Optional updates
    if "fullName" in data:
        current_user.full_name = data["fullName"]

    if "email" in data:
        current_user.email = data["email"]

    if "phone" in data:
        current_user.phone = data["phone"]

    if "dateOfBirth" in data:
        try:
            current_user.date_of_birth = datetime.strptime(
                data["dateOfBirth"], "%Y-%m-%d"
            )
        except ValueError:
            return jsonify({"message": "Invalid date format"}), 400

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "user": {
            "id": str(current_user.id),
            "fullName": current_user.full_name,
            "email": current_user.email,
            "phone": current_user.phone,
            "dateOfBirth": current_user.date_of_birth.isoformat() if current_user.date_of_birth else None,
        }
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200