import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from typing import Generator

logger = logging.getLogger("meritmind.database")

def create_db_engine():
    try:
        # Attempt MySQL engine creation and connection ping
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600,
            connect_args={"connect_timeout": 3}
        )
        # Test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to MySQL database.")
            return engine
    except Exception as e:
        logger.warning(f"MySQL connection failed ({e}). Falling back to local SQLite database (meritmind.db).")
        sqlite_url = "sqlite:///./meritmind.db"
        return create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False}
        )

engine = create_db_engine()

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get db session
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
