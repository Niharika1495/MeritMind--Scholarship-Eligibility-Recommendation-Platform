from app.database.base import Base
from app.database.connection import engine
from app.collectors.scheduler import run_all_collectors

def seed_scholarships():
    print("Creating tables in MySQL / Database...")
    Base.metadata.create_all(bind=engine)
    print("Executing automatic collectors for official sources...")
    results = run_all_collectors()
    print(f"Collection complete! Result summary: {results}")

if __name__ == "__main__":
    seed_scholarships()
