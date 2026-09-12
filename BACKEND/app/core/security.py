"""
Security utilities: password hashing and JWT token management.
Re-exports from app.services.auth_service for structured access.
"""
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
    get_current_user,
    pwd_context,
    oauth2_scheme,
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

__all__ = [
    "hash_password",
    "verify_password",
    "create_access_token",
    "decode_token",
    "get_current_user",
    "pwd_context",
    "oauth2_scheme",
    "SECRET_KEY",
    "ALGORITHM",
    "ACCESS_TOKEN_EXPIRE_MINUTES",
]
