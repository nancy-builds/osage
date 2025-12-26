from ..extensions import db, socketio
from ..models.order import Order, OrderItem
from ..models.menu_item import MenuItem

def create_order(items):
    order = Order(status="received", total=0)
    db.session.add(order)
    total = 0

    for item in items:
        menu = MenuItem.query.get(item["menu_item_id"])
        price = menu.price * item["quantity"]
        total += price

        db.session.add(OrderItem(
            order_id=order.id,
            menu_item_id=menu.id,
            quantity=item["quantity"],
            price=menu.price
        ))

    order.total = total
    db.session.commit()

    socketio.emit("new_order", {"order_id": str(order.id)}, room="kitchen")
    return order
