from sqlite3 import IntegrityError
from typing import Optional
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from ninja import Router, Schema
from ninja.security import HttpBearer
from ninja.errors import HttpError


class LoginSchema(Schema):
    """Login request schema."""

    username: str
    password: str


class RegisterSchema(Schema):
    """Register request schema."""

    username: str
    email: str
    password: str


class TokenSchema(Schema):
    """Token response schema."""

    access_token: str
    token_type: str = "bearer"


router = Router()


class AuthBearer(HttpBearer):
    """JWT Bearer token authentication."""

    def authenticate(self, request, token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            print({token})
            user_id = payload.get("user_id")
            if user_id:
                from django.contrib.auth.models import User

                try:
                    user = User.objects.get(id=user_id)
                    return {"user": user}
                except User.DoesNotExist:
                    return None
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        return None


def create_token(user_id: int) -> str:
    """Create a JWT token for a user."""
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


@router.post("/login", response=TokenSchema)
def login(request, credentials: LoginSchema) -> TokenSchema:
    """
    Authenticate user and return JWT token.

    Returns a JWT access token that can be used for authenticated requests.
    Token expires in 7 days.
    """
    user = authenticate(username=credentials.username, password=credentials.password)
    if not user:
        raise HttpError(401, "Invalid credentials")

    token = create_token(user.id)
    return TokenSchema(access_token=token, token_type="bearer")


@router.post("/register", response=TokenSchema)
def register(request, payload: RegisterSchema) -> TokenSchema:
    """
    Register user and return JWT token.

    Returns a JWT access token that can be used for authenticated requests.
    Token expires in 7 days.
    """

    try:
        user = User.objects.create(
            username=payload.username,
            email=payload.email,
            password=make_password(payload.password),
        )
    except:
        raise HttpError(409, "Email/Username taken, Please use another one")

    token = create_token(user.id)
    return TokenSchema(access_token=token, token_type="bearer")
