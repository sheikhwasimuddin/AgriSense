import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.future import select
from core.database import AsyncSessionLocal
from core.security import get_password_hash
from db import models

async def seed():
    async with AsyncSessionLocal() as session:
        print("Starting seed...")

        # 1. Create User
        result = await session.execute(select(models.User).where(models.User.email == "test@agrisense.com"))
        user = result.scalars().first()
        
        if not user:
            print("Creating test user...")
            user = models.User(
                full_name="Test Farmer",
                email="test@agrisense.com",
                phone="+1234567890",
                role="Farmer",
                hashed_password=get_password_hash("password")
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
        else:
            print("User already exists.")

        # 2. Create Farms
        result = await session.execute(select(models.Farm).where(models.Farm.user_id == user.id))
        farms = result.scalars().all()
        
        if not farms:
            print("Creating test farms...")
            farm1 = models.Farm(
                user_id=user.id,
                farm_name="Sunny Valley Farm",
                location="California, USA",
                latitude=36.7783,
                longitude=-119.4179,
                area=50.5,
                crop="Wheat"
            )
            farm2 = models.Farm(
                user_id=user.id,
                farm_name="Green Acres",
                location="Iowa, USA",
                latitude=42.0329,
                longitude=-93.5815,
                area=120.0,
                crop="Corn"
            )
            session.add_all([farm1, farm2])
            await session.commit()
            await session.refresh(farm1)
            await session.refresh(farm2)
            farms = [farm1, farm2]
        else:
            print("Farms already exist.")

        # 3. Create Sensor Data
        print("Adding sensor data...")
        now = datetime.utcnow()
        for farm in farms:
            # Check if sensor data exists to prevent infinite growth on re-runs
            res = await session.execute(select(models.SensorData).where(models.SensorData.farm_id == farm.id))
            if res.scalars().first():
                continue
                
            sensor_data_list = []
            for i in range(24): # Last 24 hours
                timestamp = now - timedelta(hours=24-i)
                data = models.SensorData(
                    farm_id=farm.id,
                    temperature=random.uniform(20.0, 35.0),
                    humidity=random.uniform(40.0, 80.0),
                    soil_moisture=random.uniform(30.0, 60.0),
                    soil_ph=random.uniform(5.5, 7.5),
                    rainfall=random.uniform(0.0, 15.0),
                    light_intensity=random.uniform(400.0, 1000.0),
                    timestamp=timestamp
                )
                sensor_data_list.append(data)
            session.add_all(sensor_data_list)
        await session.commit()

        # 4. Create Yield Predictions
        print("Adding yield predictions...")
        for farm in farms:
            res = await session.execute(select(models.YieldPrediction).where(models.YieldPrediction.farm_id == farm.id))
            if res.scalars().first():
                continue
                
            yield_data = [
                models.YieldPrediction(
                    farm_id=farm.id, crop=farm.crop, year=2021, rainfall=1200, temperature=24.5, pesticides=150, predicted_yield=random.uniform(3000, 5000), created_at=now - timedelta(days=700)
                ),
                models.YieldPrediction(
                    farm_id=farm.id, crop=farm.crop, year=2022, rainfall=1100, temperature=25.0, pesticides=160, predicted_yield=random.uniform(3000, 5000), created_at=now - timedelta(days=350)
                ),
                models.YieldPrediction(
                    farm_id=farm.id, crop=farm.crop, year=2023, rainfall=1300, temperature=23.5, pesticides=140, predicted_yield=random.uniform(3000, 5000), created_at=now - timedelta(days=10)
                )
            ]
            session.add_all(yield_data)
        await session.commit()

        # 5. Create Disease Predictions
        print("Adding disease predictions...")
        disease_names = ["Leaf Rust", "Healthy", "Blight", "Powdery Mildew"]
        for farm in farms:
            res = await session.execute(select(models.DiseasePrediction).where(models.DiseasePrediction.farm_id == farm.id))
            if res.scalars().first():
                continue
                
            disease_data = []
            for i in range(5):
                d = random.choice(disease_names)
                conf = random.uniform(70.0, 99.9)
                rec = "Apply fungicide within 2 days." if d != "Healthy" else "No action required. Crop is optimal."
                
                prediction = models.DiseasePrediction(
                    farm_id=farm.id,
                    image_url=f"https://source.unsplash.com/random/400x300/?leaf,crop,disease&sig={farm.id}{i}",
                    disease=d,
                    confidence=conf,
                    recommendation=rec,
                    created_at=now - timedelta(days=random.randint(1, 30))
                )
                disease_data.append(prediction)
            session.add_all(disease_data)
            
        await session.commit()
        print("Seed complete! You can log in with test@agrisense.com / password")

if __name__ == "__main__":
    asyncio.run(seed())
