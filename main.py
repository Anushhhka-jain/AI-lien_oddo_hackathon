from datetime import datetime
from fastapi import FastAPI, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from passlib.hash import bcrypt
from models import User
from database import engine, SessionLocal, Base
from sqlalchemy import func
from models import User, Order, Listing  # ✅ Add Order and Listing here too


# Initialize app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can later restrict this to ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

@app.post("/create-profile/")
async def create_profile(
    full_name: str = Form(...),
    email: str = Form(...),
    username: str = Form(...),
    password: str = Form(...)
):
    # Hash the password before saving
    hashed_password =password

    # Create a new user object
    new_user = User(
        full_name=full_name,
        email=email,
        username=username,
        password=hashed_password
    )

    try:
        with SessionLocal() as session:
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            return {"message": "User registered successfully", "user_id": new_user.id}

    except IntegrityError:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
@app.post("/login")
async def login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    with SessionLocal() as session:
        user = session.query(User).filter(User.email == email).first()
        if user and password == user.password:  # Plain text password check
            return {"message": "Login successful", "token": "mocked-token"}
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
@app.get("/dashboard-data")
def get_dashboard_data():
    with SessionLocal() as session:
        # Users
        user_count = session.query(func.count(User.id)).scalar()

        # Orders
        orders = session.query(Order).all()
        order_count = len(orders)
        status_counts = {"pending": 0, "processing": 0, "completed": 0, "cancelled": 0}
        revenue = 0
        for o in orders:
            status_counts[o.status] += 1
            revenue += float(o.total_amount)

        # Listings
        listing_count = session.query(func.count(Listing.id)).scalar()
        active = session.query(func.count(Listing.id)).filter(Listing.status == "active").scalar()
        pending = session.query(func.count(Listing.id)).filter(Listing.status == "pending").scalar()
        sold = session.query(func.count(Listing.id)).filter(Listing.status == "sold").scalar()

        return {
            "users": user_count,
            "orders": order_count,
            "order_status": status_counts,
            "revenue": revenue,
            "listings": listing_count,
            "listing_status": {
                "active": active,
                "pending": pending,
                "sold": sold
            }
        }
