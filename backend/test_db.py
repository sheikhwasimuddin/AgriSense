import asyncio
import asyncpg
import sys

async def test_connection():
    try:
        conn = await asyncpg.connect("postgresql://postgres.layrszkjtcbabhprcmxo:AgriSense 7421@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres")
        print("Connection successful!")
        await conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_connection())
