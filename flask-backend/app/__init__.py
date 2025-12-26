from flask import Flask

from .config import Config
from .extensions import db, migrate, bcrypt, socketio, login_manager


def create_app():
    app = Flask(__name__)

    # 🔥 BẮT BUỘC: load config TRƯỚC
    app.config.from_object(Config)

    # 🧪 DEBUG TẠM (để xác nhận)
    # print("DB URI =", app.config.get("SQLALCHEMY_DATABASE_URI"))

    # 🔥 SAU ĐÓ mới init extensions
    db.init_app(app)
    migrate.init_app(app, db)

    bcrypt.init_app(app)
    socketio.init_app(app)
    login_manager.init_app(app)

    # 🔥 IMPORT MODELS (bắt buộc cho migrate)
    from . import models

    from .routes.auth import auth_bp
    from .routes.order import order_bp
    from .routes.menu import menu_bp
    from .routes.feedback import feedback_bp
    from .routes.kitchen import kitchen_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(menu_bp, url_prefix="/api/menu")
    app.register_blueprint(order_bp, url_prefix="/api/order")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(kitchen_bp, url_prefix="/api/kitchen")

    return app

