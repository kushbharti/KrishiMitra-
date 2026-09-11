import os
import asyncio
import firebase_admin
from firebase_admin import credentials, auth
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

def test_firebase():
    print("1. Checking Firebase Admin Certificate...")
    cred_path = os.path.join(os.path.dirname(__file__), "firebase-service-account.json")
    if not os.path.exists(cred_path):
        print("❌ FAIL: 'firebase-service-account.json' is missing from backend/ folder!")
        return False
    
    try:
        cred = credentials.Certificate(cred_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        print("✅ SUCCESS: Firebase Admin SDK loaded valid service account credentials.")
        return True
    except Exception as e:
        print(f"❌ FAIL: Invalid service account file: {e}")
        return False

async def test_mongodb():
    print("2. Checking MongoDB Atlas Connection...")
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        await client.admin.command('ping')
        print("✅ SUCCESS: Connected to MongoDB Atlas cluster.")
        return True
    except Exception as e:
        print(f"❌ FAIL: MongoDB connection failed: {e}")
        return False

if __name__ == "__main__":
    fb_ok = test_firebase()
    mongo_ok = asyncio.run(test_mongodb())
    if fb_ok and mongo_ok:
        print("\n🚀 BACKEND PRE-FLIGHT CHECK PASSED!")