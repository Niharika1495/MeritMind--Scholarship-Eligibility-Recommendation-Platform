from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, profile, scholarships, recommendations, saved, applications, notifications, documents, advisor
from app.database.base import Base
from app.database.connection import engine, SessionLocal
import app.models  # Register all models with Base.metadata
from app.models.scholarship import Scholarship
from app.collectors.scheduler import run_all_collectors
import logging

logger = logging.getLogger("meritmind.main")

# Ensure all database tables exist automatically for MySQL or SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

@app.on_event("startup")
def on_startup():
    # Auto-populate scholarships if database has 0 scholarships
    db = SessionLocal()
    try:
        count = db.query(Scholarship).count()
        if count == 0:
            logger.info("Empty database detected. Auto-seeding initial scholarships...")
            run_all_collectors()
    except Exception as e:
        logger.warning(f"Auto-seed check skipped or failed: {e}")
    finally:
        db.close()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(scholarships.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(saved.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(advisor.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to MeritMind APIs. Access documentation at /api/docs"}
