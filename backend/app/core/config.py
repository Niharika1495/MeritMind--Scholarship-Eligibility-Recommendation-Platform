from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "MeritMind API"
    
    # JWT Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretkeychangeinproduction123456789")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for development
    
    # Database Settings
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "mysql")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "meritmind")
    
    @property
    def DATABASE_URL(self) -> str:
        # Build connection URL
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
