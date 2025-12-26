from flask import Blueprint, request, jsonify
from ..schemas.auth import RegisterSchema, LoginSchema
from ..services.auth import register_user, login_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "Invalid JSON"}), 400  # dùng jsonify luôn

    schema = RegisterSchema()
    schema.context["password"] = json_data.get("password")

    try:
        data = schema.load(json_data)
    except Exception as e:
        return jsonify({"message": str(e)}), 400  # catch validation error

    result, status_code = register_user(data)
    return jsonify(result), status_code  # luôn trả JSON

@auth_bp.post("/login")
def login():
    try:
        data = LoginSchema().load(request.get_json())
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    result, status_code = login_user(data)
    return jsonify(result), status_code  # luôn trả JSON