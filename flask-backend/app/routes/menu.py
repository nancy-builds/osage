from flask import Blueprint, jsonify
from ..models.menu_item import MenuItem

menu_bp = Blueprint("menu", __name__)

@menu_bp.route("", methods=["GET"])
def get_menu():
    items = MenuItem.query.filter_by(is_available=True).all()
    return jsonify([
        {
            "id": str(i.id),
            "name": i.name,
            "price": float(i.price)
        } for i in items
    ])
