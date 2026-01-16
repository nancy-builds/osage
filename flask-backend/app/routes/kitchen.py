from flask import Blueprint, request
from ..extensions import db, socketio
from ..models.order import Order

kitchen_bp = Blueprint("kitchen", __name__)


