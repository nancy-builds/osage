from flask import Blueprint, request, jsonify
from ..services.order import create_order

order_bp = Blueprint("orders", __name__)

@order_bp.route("", methods=["POST"])
def order():
    order = create_order(request.json["items"])
    return jsonify({"order_id": str(order.id)})
