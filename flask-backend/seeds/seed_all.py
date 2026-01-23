from app import create_app
from seeds.seed_menu import seed_menu
from seeds.seed_reward import seed_rewards

def run_all():
    app = create_app()
    with app.app_context():
        print("🌱 Starting database seeding...")
        seed_menu()
        seed_rewards()
        print("🎉 All seeds completed")

if __name__ == "__main__":
    run_all()
