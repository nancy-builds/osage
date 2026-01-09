from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
from uuid import uuid4

from ..extensions import db
from ..models.feedback import Feedback

feedback_bp = Blueprint("feedback", __name__)

