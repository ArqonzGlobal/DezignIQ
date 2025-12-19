import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB", "mnml_app")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]

def get_collection(name: str):
    return db[name]
