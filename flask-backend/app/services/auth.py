from ..models.user import User
from ..extensions import db, bcrypt
from flask_login import login_user as flask_login_user

def register_user(data):
    # Check existing user
    if User.query.filter_by(phone=data["phone"]).first():
        return {"message": "Phone already registered"}, 409

    password_hash = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(
        phone=data["phone"],
        password_hash=password_hash,
        role=data["role"],
        full_name=data.get("full_name")
    )

    db.session.add(user)
    db.session.commit()

    return {
        "message": "Registered successfully",
        "user_id": str(user.id)
    }, 201


def login_user(data):
    user = User.query.filter_by(phone=data["phone"]).first()

    if not user or not bcrypt.check_password_hash(
        user.password_hash, data["password"]
    ):
        return {"message": "Invalid phone or password"}, 401

    flask_login_user(user)


    return {
        "message": "Login successful",
        "user": {
            "id": str(user.id),
            "phone": user.phone,
            "role": user.role,
            "full_name": user.full_name
        }
    }, 200
