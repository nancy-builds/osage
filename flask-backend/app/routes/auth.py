from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user
from ..extensions import db, login_manager
from ..models.user import User
import uuid

auth_bp = Blueprint("auth", __name__)

@login_manager.user_loader
def load_user(user_id):
    try:
        return User.query.get(uuid.UUID(user_id))
    except Exception:
        return None


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
        # Always return JSON on error
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
