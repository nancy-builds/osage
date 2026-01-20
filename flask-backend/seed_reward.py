# seed_reward.py
from app import create_app
from app.extensions import db
from app.models.reward import Reward
from datetime import datetime, timedelta

def seed():
    app = create_app()
    with app.app_context():
        Reward.query.delete()
        db.session.commit()

        now = datetime.utcnow()

        rewards = [
            Reward(
                name="Free Miso Soup",
                description="Enjoy a complimentary traditional miso soup with your next order.",
                required_points=100,
                expires_at=now + timedelta(days=30),
                is_active=True,
                image_url="/menu/dragon_roll.png",

            ),
            Reward(
                name="Salmon Avocado Roll - 20% Off",
                description="Get 20% off our signature Salmon Avocado Roll.",
                required_points=400,
                expires_at=now + timedelta(days=21),
                is_active=True,
                image_url="/menu/dragon_roll.png",

            ),
            # ... other rewards
        ]

        db.session.add_all(rewards)
        db.session.commit()

        print("✅ Rewards seeded successfully")

if __name__ == "__main__":
    seed()
