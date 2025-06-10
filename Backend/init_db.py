#!/usr/bin/env python3
"""
Database initialization script for Firstcare Registration System
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from main import Base, User, engine

def init_database():
    """Initialize the database with tables and sample data"""
    print("🗄️  Initializing database...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
        
        # Create session
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Check if we already have data
        user_count = db.query(User).count()
        if user_count > 0:
            print(f"📊 Database already contains {user_count} users")
            return
        
        # Create sample admin user for testing
        sample_user = User(
            registration_id="FHP20241209ADMIN01",
            first_name="Admin",
            middle_name="Test",
            last_name="User",
            date_of_birth="1990-01-01",
            sex="M",
            phone_number="08012345678",
            nin="12345678901",
            address="Test Address, Kaduna",
            state="Kaduna",
            lga="Kaduna North",
            zone="Kaduna Region",
            unit="Admin Unit",
            emergency_contact_name="Emergency Contact",
            emergency_contact_address="Emergency Address",
            emergency_contact_phone="08087654321",
            beneficiary1_name="Beneficiary One",
            beneficiary1_address="Beneficiary Address",
            beneficiary1_phone="08011111111",
            beneficiary1_relationship="Spouse",
            registration_fee_paid=True,
            daily_dues_balance=2400.0,
            membership_status="active"
        )
        
        db.add(sample_user)
        db.commit()
        
        print("✅ Sample data created successfully")
        print(f"📝 Created admin user with ID: {sample_user.registration_id}")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
