import os
from flask import Flask
from .config import Config
from .extensions import db, migrate, bcrypt, socketio, login_manager
from flask_cors import CORS
from flask_migrate import upgrade


def create_app():
    app = Flask(__name__)

    CORS(
        app,
        origins=[
            "http://localhost:3000",
            "https://osage-k7he.vercel.app"
        ],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    socketio.init_app(
        app,
        cors_allowed_origins=[
            "http://localhost:3000",
            "https://osage-k7he.vercel.app"
        ]
    )

    login_manager.init_app(app)

    with app.app_context():
        # ✅ ALWAYS apply migrations
        print("⬆️ Running database migrations")
        upgrade()

        # 🌱 Seed only if explicitly enabled
        if os.getenv("SEED_ON_STARTUP") == "true":
            print("🌱 Seeding enabled")

            from seeds.seed_menu import seed_menu
            from seeds.seed_reward import seed_rewards

            seed_menu()
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
