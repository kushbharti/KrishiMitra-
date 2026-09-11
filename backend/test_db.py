import asyncio
from db.mongodb import connect_to_mongo, get_database, close_mongo_connection

async def main():
    await connect_to_mongo()
    db = await get_database()
    user = await db.users.find_one({'email': 'admin@gmail.com'})
    print(user)
    await close_mongo_connection()

asyncio.run(main())
