from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.security import decode_access_token
from app.models.student import Student

# Set API login path as OAuth schema source
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> Student:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session expired or invalid token. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
        
    email = decode_access_token(token)
    if email is None:
        raise credentials_exception
        
    user = db.query(Student).filter(Student.email == email).first()
    if user is None:
        raise credentials_exception
    return user
