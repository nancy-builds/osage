from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from flask_login import LoginManager
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

bcrypt = Bcrypt()
socketio = SocketIO(cors_allowed_origins="*")

login_manager = LoginManager()
login_manager.login_view = "auth.login"

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({
        "message": "Login first to submit feedback"
    }), 401