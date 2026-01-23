# seed_menu.py
from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product
from app.models.order import OrderItem

MENU_ITEMS = [
    {
        "name": "Edamame",
        "name_japanese": "枝豆",
        "description": "Steamed soybeans with sea salt",
        "price": 100000,
        "category": "Appetizers",
        "vegetarian": True,
        "image_url": "/menu/edamame.png",
    },
    {
        "name": "Gyoza",
        "name_japanese": "餃子",
        "description": "Pan-fried dumplings with pork and vegetables",
        "price": 210000,
        "category": "Appetizers",
        "image_url": "/menu/gyoza.png",
    },
    {
        "name": "Tempura",
        "name_japanese": "てんぷら",
        "description": "Lightly battered and fried shrimp and vegetables",
        "price": 320000,
        "category": "Appetizers",
        "vegetarian": False,
        "image_url": "/menu/tempura.png",
    },
    {
        "name": "Teriyaki Chicken",
        "name_japanese": "チキン照り焼き",
        "description": "Grilled chicken with teriyaki sauce",
        "price": 98000,
        "category": "Main Courses",
        "image_url": "/menu/teriyaki.png",   
    },
    {
        "name": "Salmon Sashimi",
        "name_japanese": "サーモン刺身",
        "description": "Fresh sliced salmon, 3 pieces",
        "price": 60000,
        "category": "Main Courses",
        "image_url": "/menu/salmon_sashimi.png",
    },
    {
        "name": "Tonkatsu",
        "name_japanese": "とんかつ",
        "description": "Breaded pork cutlet with panko crust",
        "price": 120000,
        "category": "Main Courses",
        "image_url": "/menu/tonkatsu.png",
    },
    {
        "name": "Ramen",
        "name_japanese": "ベジタブルラーメン",
        "description": "Noodles in rich broth with pork and vegetables",
        "price": 230000,
        "category": "Main Courses",
        "image_url": "/menu/ramen.png",
    },
    {
        "name": "Vegetable Ramen",
        "name_japanese": "ベジタブルラーメン",
        "description": "Noodles in rich broth with vegetables",
        "price": 80000,
        "category": "Main Courses",
        "vegetarian": True,
        "image_url": "/menu/vegetable_ramen.png",
    },
    {
        "name": "California Roll",
        "name_japanese": "カリフォルニアロール",
        "description": "Crab, avocado, cucumber - 6 pieces",
        "price": 99000,
        "category": "Sushi",
        "vegetarian": False,
        "image_url": "/menu/california_roll.png",
    },
    {
        "name": "Spicy Tuna Roll",
        "name_japanese": "スパイシーツナロール",
        "description": "Spicy tuna with cucumber - 6 pieces",
        "price": 190000,
        "category": "Sushi",
        "spicy": 3,
        "image_url": "/menu/spicy_tuna_roll.png",
    },
    {
        "name": "Dragon Roll",
        "name_japanese": "ドラゴンロール",
        "description": "Shrimp tempura, cucumber, avocado - 6 pieces",
        "price": 120000,
        "category": "Sushi",
        "image_url": "/menu/dragon_roll.png",
    },
    {
        "name": "Sake",
        "name_japanese": "酒",
        "description": "Traditional rice wine - 6oz",
        "price": 80000,
        "category": "Beverages",
        "vegetarian": True,
        "image_url": "/menu/sake.png",
    },
    {
        "name": "Green Tea",
        "name_japanese": "緑茶",
        "description": "Hot green tea",
        "price": 29000,
        "category": "Beverages",
        "vegetarian": True,
        "image_url": "/menu/green_tea.png",
    },
    {
        "name": "Mango Smoothie",
        "name_japanese": "マンゴースムージー",
        "description": "Fresh mango smoothie",
        "price": 59000,
        "category": "Beverages",
        "vegetarian": True,
        "image_url": "/menu/mango_smoothie.png",
    },
]


def seed_menu():
    if Product.query.first():
        print("⚠️ Menu already exists, skipping")
        return

    categories_cache = {}

    for item in MENU_ITEMS:
        category_name = item.pop("category")

        if category_name not in categories_cache:
            category = Category.query.filter_by(name=category_name).first()
            if not category:
                category = Category(name=category_name)
                db.session.add(category)
                db.session.flush()
            categories_cache[category_name] = category

        product = Product(
            **item,
            category_id=categories_cache[category_name].id
        )
        db.session.add(product)

    db.session.commit()
    print("✅ Menu seeded")