from functools import wraps
from flask import request, jsonify
from flask_login import current_user

def role_required(role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({"error": "Role required. Login required"}), 401

            if current_user.role != role:
                return jsonify({"error": "Role required. Permission denied"}), 403

            return f(*args, **kwargs)
        return wrapper
    return decorator
