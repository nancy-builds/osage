from marshmallow import Schema, fields, validate, validates, ValidationError

class RegisterSchema(Schema):
    phone = fields.Str(
        required=True,
        validate=validate.Regexp(r'^\d+$')
    )
    password = fields.String(
        required=True,
        validate=validate.Length(min=6)
    )
    confirm_password = fields.String(required=True)
    role = fields.String(
        required=True,
        validate=validate.OneOf(["customer", "restaurant", "admin"])
    )
    full_name = fields.String(required=False)

    @validates("confirm_password")
    def validate_password_match(self, value, **kwargs):
        if value != self.context.get("password"):
            raise ValidationError("Passwords do not match")

class LoginSchema(Schema):
    phone = fields.Str(required=True)
    password = fields.String(required=True)
