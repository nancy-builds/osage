from flask import Blueprint, jsonify
from ..models.product import Product
from app.utils.permissions import role_required
from app.constants.roles import Roles
from flask_login import login_required, current_user

menu_bp = Blueprint("menu", __name__)

@menu_bp.route("/products", methods=["GET"])
def get_all_products():
    try:
        products = Product.query.filter_by(is_available=True).all()

        return jsonify([
            {
                "id": str(p.id),
                "category_id": str(p.category_id),
                "category": p.category.name,
                "name": p.name,
                "name_japanese": p.name_japanese,
                "description": p.description,
                "price": float(p.price),        # 🔴 REQUIRED
                "vegetarian": bool(p.vegetarian),
                "spicy": p.spicy,
                "is_available": bool(p.is_available),
                "created_at": p.created_at.isoformat(),  # 🔴 REQUIRED
                "image_url": p.image_url,
            }
            for p in products
        ])

    except Exception as e:
        print("❌ MENU ERROR:", e)
        return jsonify({"error": str(e)}), 500
