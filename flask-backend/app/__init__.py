import os
from flask import Flask
from .config import Config
from .extensions import db, migrate, bcrypt, socketio, login_manager
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    CORS(
        app,
        origins=[
            "http://localhost:3000",
            "https://osage-k7he.vercel.app"  # 👈 add prod frontend
        ],
        supports_credentials=True
    )

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    login_manager.init_app(app)

    with app.app_context():
        if os.getenv("SEED_ON_STARTUP") == "false":
            print("🔥 SEED_ON_STARTUP = TRUE")

            from flask_migrate import upgrade
            upgrade()

            from seeds.seed_menu import seed_menu
            from seeds.seed_reward import seed_rewards

            print("🌱 Running seed_menu()")
            seed_menu()

            print("🌱 Running seed_rewards()")
            seed_rewards()

            print("✅ Seeding finished")

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
