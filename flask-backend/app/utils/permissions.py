from functools import wraps
from flask import request, jsonify
from flask_login import current_user

def role_required(role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # 🔥 LET PREFLIGHT PASS
            if request.method == "OPTIONS":
                return f(*args, **kwargs)

            if not current_user.is_authenticated:
                return jsonify({"error": "Login required"}), 401

            if current_user.role != role:
                return jsonify({"error": "Permission denied"}), 403

            return f(*args, **kwargs)
        return wrapper
    return decorator
