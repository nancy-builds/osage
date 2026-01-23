from datetime import datetime, timedelta
from app.extensions import db
from app.models.reward import Reward

def seed_rewards():
    if Reward.query.first():
        print("⚠️ Rewards already exist, skipping")
        return

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
    ]

    db.session.add_all(rewards)
    db.session.commit()
    print("✅ Rewards seeded")
