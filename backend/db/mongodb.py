"""
MongoDB Atlas connection management for AgroVision / KrishiMitra.

Responsibilities
----------------
- Load the connection URI from settings (never hardcode)
- Validate the URI is present and looks plausible before connecting
- Mask credentials in every log line so passwords are never exposed
- Distinguish between the main failure categories in log output:
    URI missing | URI malformed | DNS/SRV failure | server unreachable |
    authentication failed | connection successful
- Use a generous serverSelectionTimeoutMS so intermittent DNS latency
  (common on home / corporate Wi-Fi with SRV records) does not cause a
  spurious startup failure
- Expose get_database() for use as a FastAPI Depends()
"""

import re
from urllib.parse import urlparse

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import (
    ConfigurationError,
    ConnectionFailure,
    OperationFailure,
    ServerSelectionTimeoutError,
)

from core.config import settings


# ---------------------------------------------------------------------------
# Singleton holder
# ---------------------------------------------------------------------------

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None


mongodb = MongoDB()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _mask_uri(uri: str) -> str:
    """
    Return the URI with the password replaced by ****.
    Never log the raw URI — always pass it through this function first.
    """
    if not uri:
        return "<empty>"
    try:
        # Replace :password@ with :****@ (first occurrence only)
        return re.sub(r"(:)[^:@/]+(@)", r"\1****\2", uri, count=1)
    except Exception:
        return "<unparseable URI>"


def _validate_uri(uri: str):
    """
    Return an error description string if the URI looks wrong, else None.
    """
    if not uri or uri.strip() == "":
        return "MONGODB_URL is empty"

    stripped = uri.strip()
    if not (
        stripped.startswith("mongodb://")
        or stripped.startswith("mongodb+srv://")
    ):
        return (
            f"MONGODB_URL does not start with 'mongodb://' or 'mongodb+srv://'. "
            f"Got: {stripped[:30]}..."
        )

    try:
        parsed = urlparse(stripped)
        if not parsed.hostname:
            return "MONGODB_URL has no hostname"
    except Exception as exc:
        return f"MONGODB_URL is malformed: {exc}"

    return None  # URI looks plausible


# ---------------------------------------------------------------------------
# Connection lifecycle
# ---------------------------------------------------------------------------

async def connect_to_mongo():
    """
    Create the Motor client and verify the connection with a ping.

    Log messages are structured so it is easy to understand *why* a failure
    occurred without ever printing credentials.

    Raises the original exception so the FastAPI lifespan can decide whether
    to abort startup (which it should for a required dependency).
    """
    uri = settings.MONGODB_URL
    masked = _mask_uri(uri)

    # ---- 1. Validate URI -----------------------------------------------
    validation_error = _validate_uri(uri)
    if validation_error:
        print(f"[Database] STARTUP FAILURE — URI validation error: {validation_error}")
        print(f"[Database] Set MONGODB_URL in backend/.env  (masked current value: {masked})")
        raise ValueError(f"MongoDB URI invalid: {validation_error}")

    print(f"[Database] Connecting to MongoDB Atlas ... ({masked})")

    # ---- 2. Create client -----------------------------------------------
    # serverSelectionTimeoutMS: 30 000 ms (30 s) gives SRV DNS resolution
    # plus TCP handshake enough headroom even on slow Wi-Fi / VPN.
    # connectTimeoutMS: 20 000 ms for the individual TCP connect.
    try:
        mongodb.client = AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=30_000,   # wait up to 30 s for server selection
            connectTimeoutMS=20_000,            # individual TCP connect timeout
            socketTimeoutMS=30_000,             # individual socket operation timeout
        )
        mongodb.db = mongodb.client[settings.MONGODB_DB_NAME]
    except ConfigurationError as exc:
        _log_configuration_error(exc, masked)
        raise

    # ---- 3. Verify connectivity with ping --------------------------------
    try:
        await mongodb.client.admin.command("ping")
        print(
            f"[Database] MongoDB Atlas connection SUCCESSFUL "
            f"(db: {settings.MONGODB_DB_NAME})"
        )
    except ConfigurationError as exc:
        _log_configuration_error(exc, masked)
        mongodb.client.close()
        mongodb.client = None
        raise
    except ServerSelectionTimeoutError as exc:
        _log_server_selection_error(exc, masked)
        mongodb.client.close()
        mongodb.client = None
        raise
    except OperationFailure as exc:
        print(
            "[Database] STARTUP FAILURE — MongoDB authentication failed. "
            "Check the username and password in MONGODB_URL."
        )
        print(f"[Database] Masked URI: {masked}")
        print(f"[Database] Auth error detail: {exc.details}")
        mongodb.client.close()
        mongodb.client = None
        raise
    except ConnectionFailure as exc:
        print(
            f"[Database] STARTUP FAILURE — MongoDB server unreachable: {exc}"
        )
        print(f"[Database] Masked URI: {masked}")
        mongodb.client.close()
        mongodb.client = None
        raise
    except Exception as exc:
        print(
            f"[Database] STARTUP FAILURE — Unexpected error during ping: "
            f"{type(exc).__name__}: {exc}"
        )
        print(f"[Database] Masked URI: {masked}")
        mongodb.client.close()
        mongodb.client = None
        raise


def _log_configuration_error(exc: ConfigurationError, masked: str) -> None:
    """Provide a structured log for ConfigurationError (covers DNS/SRV failures)."""
    msg = str(exc)
    if "resolution lifetime expired" in msg or "DNS operation timed out" in msg:
        print(
            "[Database] STARTUP FAILURE — DNS/SRV resolution timed out while "
            "resolving the MongoDB Atlas hostname."
        )
        print(
            "[Database] This is a NETWORK/DNS problem, not an application code problem."
        )
        print("[Database] Troubleshooting steps:")
        print("  1. Run:  nslookup -type=SRV _mongodb._tcp.<cluster>.mongodb.net 8.8.8.8")
        print("  2. Run:  nslookup google.com")
        print("  3. Try a mobile hotspot to rule out your current Wi-Fi DNS.")
        print("  4. Check MongoDB Atlas -> Network Access -> IP Allowlist.")
        print("  5. Temporarily disable firewall/antivirus DNS filtering.")
        print("  6. Run: ipconfig /flushdns   then retry.")
    else:
        print(f"[Database] STARTUP FAILURE — MongoDB ConfigurationError: {exc}")
    print(f"[Database] Masked URI: {masked}")


def _log_server_selection_error(exc: ServerSelectionTimeoutError, masked: str) -> None:
    """Provide a structured log for ServerSelectionTimeoutError."""
    msg = str(exc)
    if "timed out" in msg.lower() or "timeout" in msg.lower():
        print(
            "[Database] STARTUP FAILURE — Could not reach MongoDB Atlas servers within "
            "the timeout period."
        )
        print(
            "[Database] Possible causes: "
            "firewall blocking port 27017, IP not in Atlas allowlist, "
            "or network latency."
        )
        print("[Database] Check MongoDB Atlas -> Network Access -> IP Allowlist.")
        print("[Database] If your IP changes frequently, add 0.0.0.0/0 temporarily for testing.")
    else:
        print(
            f"[Database] STARTUP FAILURE — MongoDB server selection failed: {exc}"
        )
    print(f"[Database] Masked URI: {masked}")


# ---------------------------------------------------------------------------
# Shutdown
# ---------------------------------------------------------------------------

async def close_mongo_connection():
    """Cleanly close the Motor client during FastAPI shutdown."""
    if mongodb.client is not None:
        print("[Database] Closing MongoDB connection...")
        mongodb.client.close()
        mongodb.client = None
        mongodb.db = None
        print("[Database] MongoDB connection closed.")


# ---------------------------------------------------------------------------
# FastAPI dependency
# ---------------------------------------------------------------------------

def get_database():
    """
    FastAPI Depends() provider.
    Returns the Motor database handle.
    Raises HTTP 503 if the database is not connected (defensive guard).
    """
    if mongodb.db is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not connected. Please try again later.",
        )
    return mongodb.db