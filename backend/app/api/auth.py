from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut
from app.models.student import Student
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    pwd_hash = get_password_hash(user_in.password)
    student = Student(
        email=user_in.email.lower(),
        name=user_in.name,
        password_hash=pwd_hash
    )
    db.add(student)
    db.commit()
    return {"message": "Account created successfully."}

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == user_in.email.lower()).first()
    if not student or not verify_password(user_in.password, student.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please try again."
        )
    
    access_token = create_access_token(subject=student.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully."}

@router.get("/me", response_model=UserOut)
def read_me(current_user: Student = Depends(get_current_user)):
    is_setup = current_user.profile is not None
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_profile_setup_completed": is_setup
    }
