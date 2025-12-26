from flask import Blueprint, request
from ..extensions import db, socketio
from ..models.order import Order

kitchen_bp = Blueprint("kitchen", __name__)

@kitchen_bp.route("/orders/<id>/status", methods=["PATCH"])
def update_status(id):
    order = Order.query.get(id)
    order.status = request.json["status"]
    db.session.commit()

    socketio.emit("order_status_update", {
        "order_id": str(order.id),
        "status": order.status
    })

    return {"success": True}
