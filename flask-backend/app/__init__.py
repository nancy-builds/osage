from flask import Flask
from .config import Config
from .extensions import db, migrate, bcrypt, socketio, login_manager
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    CORS(
        app,
        origins=["https://osage-k7he.vercel.app"],
        supports_credentials=True
    )

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    login_manager.init_app(app)

    # 🔥 IMPORTANT: import models BEFORE create_all
    from . import models

    with app.app_context():
        db.create_all()


    from .routes.auth import auth_bp
    from .routes.order import order_bp
    from .routes.menu import menu_bp
    from .routes.feedback import feedback_bp
    from .routes.reward import reward_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(menu_bp, url_prefix="/api/menu")
    app.register_blueprint(order_bp, url_prefix="/api/order")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(reward_bp, url_prefix="/api/reward")

    return app
