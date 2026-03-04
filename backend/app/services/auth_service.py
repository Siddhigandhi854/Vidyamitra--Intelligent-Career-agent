from datetime import datetime, timedelta, timezone
from typing import Optional
import time
import bcrypt

from jose import JWTError, jwt

from app.services.supabase_client import supabase, test_supabase_connection, fallback_create_user, fallback_get_user
from app.settings import settings

# Removed passlib - using bcrypt directly to avoid version conflicts


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt directly (more reliable than passlib for this).
    Bcrypt has a 72-byte limit, so we truncate if necessary.
    """
    if not password:
        raise ValueError("Password cannot be empty")
    
    # Ensure we're working with a string
    if not isinstance(password, str):
        password = str(password)
    
    # Convert to bytes to check actual byte length
    password_bytes = password.encode('utf-8')
    
    # Truncate to 72 bytes if necessary (bcrypt limit)
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    # Use bcrypt directly instead of passlib to avoid any encoding issues
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # Return as string (bcrypt returns bytes)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash using bcrypt directly.
    """
    if not plain_password or not hashed_password:
        return False
    
    # Convert to bytes
    password_bytes = plain_password.encode('utf-8')
    
    # Truncate to 72 bytes if necessary
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    # Convert hash to bytes if it's a string
    if isinstance(hashed_password, str):
        hash_bytes = hashed_password.encode('utf-8')
    else:
        hash_bytes = hashed_password
    
    # Use bcrypt directly to verify
    try:
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False


def get_user_password_hash(username: str) -> Optional[str]:
    # Always try Supabase first - it's the primary database
    if supabase:
        try:
            # Add retry logic for Supabase connection
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = (
                        supabase.table("app_users")
                        .select("password_hash")
                        .eq("username", username)
                        .maybe_single()
                        .execute()
                    )
                    if response and response.data:
                        return response.data.get("password_hash")
                    return None
                except Exception as e:
                    if attempt == max_retries - 1:
                        print(f"Supabase query failed after {max_retries} attempts: {e}")
                        # Only fallback if Supabase is completely unavailable
                        if not supabase:
                            break
                        # Otherwise, return None (user doesn't exist)
                        return None
                    print(f"Supabase query attempt {attempt + 1} failed: {e}")
                    time.sleep(0.5)  # Wait 0.5 seconds before retry
        except Exception as e:
            print(f"Supabase query error: {e}")
            # Only use fallback if Supabase is not configured
            if not supabase:
                return fallback_get_user(username)
            return None
    
    # Fallback to in-memory storage only if Supabase not configured
    print(f"Supabase not configured, using fallback storage for user: {username}")
    return fallback_get_user(username)

def _process_user_response(response) -> Optional[str]:
    """Helper function to process Supabase response"""
    if response is None:
        return None
    data = response.data
    if not data:
        return None
    return data.get("password_hash")


def user_exists(username: str) -> bool:
    return get_user_password_hash(username) is not None


def create_user(username: str, password_hash: str) -> None:
    # Always try Supabase first - it's the primary database
    if supabase:
        try:
            # Add retry logic for Supabase connection
            max_retries = 3
            last_error = None
            for attempt in range(max_retries):
                try:
                    result = supabase.table("app_users").insert(
                        {"username": username, "password_hash": password_hash, "created_at": "now()"}
                    ).execute()
                    print(f"User {username} created successfully in Supabase")
                    return  # Success, exit function
                except Exception as e:
                    last_error = e
                    if attempt == max_retries - 1:
                        print(f"Supabase create user failed after {max_retries} attempts: {e}")
                        # Don't break - raise the error to ensure Supabase is used
                        raise Exception(f"Failed to create user in Supabase: {str(e)}")
                    print(f"Supabase connection attempt {attempt + 1} failed: {e}")
                    time.sleep(1)  # Wait 1 second before retry
        except Exception as e:
            print(f"Supabase create user error: {e}")
            # Only use fallback if Supabase is completely unavailable
            if not supabase:
                print(f"Supabase not available, using fallback storage for user creation: {username}")
                if fallback_create_user(username, password_hash):
                    print(f"User {username} created successfully in fallback storage")
                    return
            # Re-raise the error to ensure we know Supabase failed
            raise RuntimeError(f"Failed to create user in Supabase: {str(e)}")
    else:
        # Supabase not configured - use fallback
        print(f"Supabase not configured, using fallback storage for user creation: {username}")
        if fallback_create_user(username, password_hash):
            print(f"User {username} created successfully in fallback storage")
        else:
            raise RuntimeError("Failed to create user: Supabase not configured and fallback failed")


def create_access_token(
    data: dict, secret_key: str, algorithm: str = "HS256", expires_minutes: int = 60
) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt


def decode_access_token(
    token: str, secret_key: str, algorithm: str = "HS256"
) -> Optional[dict]:
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    except JWTError:
        return None

