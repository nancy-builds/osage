from uuid import uuid4

from ..extensions import db

class MenuItem(db.Model):
    __tablename__ = "menu_items"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid4)
    category_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("categories.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
    name_japanese = db.Column(db.String)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    vegetarian = db.Column(db.Boolean, default=False)
    spicy = db.Column(db.Integer)
    is_available = db.Column(db.Boolean, default=True)
