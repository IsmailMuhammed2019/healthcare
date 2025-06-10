from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List
import qrcode
import json
import os
import uuid
import aiofiles
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import inch
from PIL import Image
import io

app = FastAPI(title="Firstcare Registration API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./registration.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(String, unique=True, index=True)
    first_name = Column(String, index=True)
    middle_name = Column(String, nullable=True)
    last_name = Column(String, index=True)
    date_of_birth = Column(String)
    sex = Column(String)
    phone_number = Column(String)
    nin = Column(String)
    address = Column(String)
    state = Column(String)
    lga = Column(String)
    zone = Column(String)
    unit = Column(String)
    photo_path = Column(String, nullable=True)
    emergency_contact_name = Column(String)
    emergency_contact_address = Column(String)
    emergency_contact_phone = Column(String)
    beneficiary1_name = Column(String)
    beneficiary1_address = Column(String)
    beneficiary1_phone = Column(String)
    beneficiary1_relationship = Column(String)
    beneficiary2_name = Column(String, nullable=True)
    beneficiary2_address = Column(String, nullable=True)
    beneficiary2_phone = Column(String, nullable=True)
    beneficiary2_relationship = Column(String, nullable=True)
    registration_fee_paid = Column(Boolean, default=False)
    registration_fee_amount = Column(Float, default=6000.0)
    daily_dues_balance = Column(Float, default=0.0)
    membership_status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    issue_date = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(
        DateTime, default=lambda: datetime.utcnow() + timedelta(days=365)
    )


Base.metadata.create_all(bind=engine)


# Pydantic models
class UserRegistration(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    date_of_birth: str
    sex: str
    phone_number: str
    nin: str
    address: str
    state: str
    lga: str
    zone: str
    unit: str
    emergency_contact_name: str
    emergency_contact_address: str
    emergency_contact_phone: str
    beneficiary1_name: str
    beneficiary1_address: str
    beneficiary1_phone: str
    beneficiary1_relationship: str
    beneficiary2_name: Optional[str] = None
    beneficiary2_address: Optional[str] = None
    beneficiary2_phone: Optional[str] = None
    beneficiary2_relationship: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    registration_id: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    date_of_birth: str
    sex: str
    phone_number: str
    nin: str
    membership_status: str
    registration_fee_paid: bool
    created_at: datetime


class PaymentUpdate(BaseModel):
    registration_id: str
    amount: float
    payment_type: str  # "registration" or "daily_dues"


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Utility functions
def generate_registration_id():
    return f"FHP{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"


def create_qr_code(data: dict):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(json.dumps(data))
    qr.make(fit=True)

    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_buffer = io.BytesIO()
    qr_img.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)
    return qr_buffer


def generate_id_card(user: User, db_user: User):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=(3.375 * inch, 2.125 * inch))

    # Background gradient (simulate with two rectangles)
    p.setFillColorRGB(0.85, 0.97, 0.90)
    p.roundRect(0, 0, 3.375 * inch, 2.125 * inch, 12, fill=1, stroke=0)
    p.setFillColorRGB(0.16, 0.64, 0.36)
    p.roundRect(
        0, 2.0 * inch, 3.375 * inch, 0.2 * inch, 12, fill=1, stroke=0
    )  # Header bar

    # Logo
    logo_path = "logo.png"  # Place logo.png in your Backend folder
    if os.path.exists(logo_path):
        p.drawImage(
            logo_path,
            0.15 * inch,
            1.85 * inch,
            width=0.35 * inch,
            height=0.35 * inch,
            mask="auto",
        )

    # Organization Name
    p.setFont("Helvetica-Bold", 10)
    p.setFillColorRGB(1, 1, 1)
    p.drawString(0.55 * inch, 2.03 * inch, "FIRSTCARE HEALTH PARTNERS")

    # Card Title
    p.setFont("Helvetica", 7)
    p.setFillColorRGB(0.16, 0.64, 0.36)
    p.drawString(0.15 * inch, 1.75 * inch, "DIGITAL MEMBER ID CARD")

    # Photo
    if user.photo_path and os.path.exists(user.photo_path):
        try:
            img = Image.open(user.photo_path)
            img = img.resize((80, 100))
            img_buffer = io.BytesIO()
            img.save(img_buffer, format="PNG")
            img_buffer.seek(0)
            p.drawImage(
                ImageReader(img_buffer),
                0.15 * inch,
                0.95 * inch,
                width=0.8 * inch,
                height=1.0 * inch,
                mask="auto",
            )
        except Exception as e:
            pass

    # QR Code
    qr_data = {
        "registration_id": user.registration_id,
        "name": f"{user.first_name} {user.last_name}",
        "phone": user.phone_number,
        "status": "active" if user.registration_fee_paid else "pending",
        "issue_date": user.issue_date.isoformat(),
    }
    qr_buffer = create_qr_code(qr_data)
    p.drawImage(
        ImageReader(qr_buffer),
        2.4 * inch,
        0.95 * inch,
        width=0.8 * inch,
        height=0.8 * inch,
        mask="auto",
    )

    # Member Info
    p.setFont("Helvetica-Bold", 9)
    p.setFillColorRGB(0.16, 0.64, 0.36)
    p.drawString(
        1.05 * inch,
        1.7 * inch,
        f"{user.last_name.upper()} {user.first_name} {user.middle_name or ''}".strip(),
    )

    p.setFont("Helvetica", 7)
    p.setFillColorRGB(0, 0, 0)
    p.drawString(1.05 * inch, 1.55 * inch, f"Reg ID: {user.registration_id}")
    p.drawString(1.05 * inch, 1.45 * inch, f"DOB: {user.date_of_birth}")
    p.drawString(
        1.05 * inch, 1.35 * inch, f"Sex: {user.sex}   Phone: {user.phone_number}"
    )
    p.drawString(1.05 * inch, 1.25 * inch, f"NIN: {user.nin}")
    p.drawString(1.05 * inch, 1.15 * inch, f"Zone: {user.zone}   Unit: {user.unit}")

    # Status
    status_color = (
        (0.16, 0.64, 0.36) if user.registration_fee_paid else (0.86, 0.07, 0.23)
    )
    p.setFont("Helvetica-Bold", 8)
    p.setFillColorRGB(*status_color)
    p.drawString(
        1.05 * inch,
        1.05 * inch,
        f"Status: {'ACTIVE' if user.registration_fee_paid else 'PENDING'}",
    )

    # Footer bar
    p.setFillColorRGB(0.16, 0.64, 0.36)
    p.roundRect(0, 0, 3.375 * inch, 0.22 * inch, 12, fill=1, stroke=0)
    p.setFont("Helvetica", 6)
    p.setFillColorRGB(1, 1, 1)
    p.drawString(
        0.15 * inch,
        0.12 * inch,
        "No 6, Yusuf Mohammed street, Narayi Highcost, Barnawa, Kaduna | admin@firstcaregroup.com",
    )

    p.save()
    buffer.seek(0)
    return buffer


# API Routes
@app.post("/api/register", response_model=UserResponse)
async def register_user(user_data: UserRegistration, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.nin == user_data.nin).first()
    if existing_user:
        raise HTTPException(
            status_code=400, detail="User with this NIN already registered"
        )

    # Create new user
    registration_id = generate_registration_id()
    db_user = User(registration_id=registration_id, **user_data.dict())

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@app.post("/api/upload-photo/{registration_id}")
async def upload_photo(
    registration_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.registration_id == registration_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)

    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{registration_id}_photo{file_extension}"
    file_path = os.path.join("uploads", filename)

    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)

    # Update user record
    user.photo_path = file_path
    db.commit()

    return {"message": "Photo uploaded successfully", "file_path": file_path}


@app.get("/api/user/{registration_id}", response_model=UserResponse)
async def get_user(registration_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.registration_id == registration_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/api/payment")
async def update_payment(payment: PaymentUpdate, db: Session = Depends(get_db)):
    user = (
        db.query(User).filter(User.registration_id == payment.registration_id).first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payment.payment_type == "registration":
        user.registration_fee_paid = True
        user.membership_status = "active"
    elif payment.payment_type == "daily_dues":
        user.daily_dues_balance += payment.amount

    db.commit()
    return {"message": "Payment updated successfully"}


@app.get("/api/generate-card/{registration_id}")
async def generate_card(registration_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.registration_id == registration_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate PDF card
    pdf_buffer = generate_id_card(user, user)

    # Save PDF file
    os.makedirs("cards", exist_ok=True)
    pdf_filename = f"card_{registration_id}.pdf"
    pdf_path = os.path.join("cards", pdf_filename)

    with open(pdf_path, "wb") as f:
        f.write(pdf_buffer.getvalue())

    return FileResponse(pdf_path, filename=pdf_filename, media_type="application/pdf")


@app.get("/api/qr-data/{registration_id}")
async def get_qr_data(registration_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.registration_id == registration_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    qr_data = {
        "registration_id": user.registration_id,
        "name": f"{user.first_name} {user.last_name}",
        "phone": user.phone_number,
        "status": "active" if user.registration_fee_paid else "pending",
        "payment_status": {
            "registration_fee_paid": user.registration_fee_paid,
            "daily_dues_balance": user.daily_dues_balance,
        },
        "issue_date": user.issue_date.isoformat(),
        "zone": user.zone,
        "unit": user.unit,
    }

    return qr_data


@app.get("/api/users")
async def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
