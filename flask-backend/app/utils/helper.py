from flask_login import current_user

def is_customer():
    return (
        current_user.is_authenticated
        and hasattr(current_user, "role")
        and current_user.role == "customer"
    )

def is_admin():
    return (
        current_user.is_authenticated
        and hasattr(current_user, "role")
        and current_user.role == "admin"
    )
