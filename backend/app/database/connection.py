import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from typing import Generator

logger = logging.getLogger("meritmind.database")

IS_SQLITE = False

def safe_print(msg: str):
    try:
        print(msg)
    except UnicodeEncodeError:
        # Fallback for Windows consoles with cp1252 character encoding
        clean_msg = msg.encode("ascii", "replace").decode("ascii")
        print(clean_msg)

def create_db_engine():
    global IS_SQLITE
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
            safe_print("✓ Connected to MySQL")
            logger.info("✓ Connected to MySQL")
            IS_SQLITE = False
            return engine
    except Exception as e:
        safe_print(f"⚠ MySQL unavailable. Using SQLite. ({e})")
        logger.warning(f"⚠ MySQL unavailable. Using SQLite. ({e})")
        IS_SQLITE = True
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
