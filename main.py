from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize FastAPI
app = FastAPI()

# 🔥 Firebase setup
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# Test route
@app.get("/")
def home():
    return {"message": "API Working"}

# ✅ Step 4 — Add Habit API
@app.post("/add-habit")
def add_habit(name: str):
    db.collection("habits").add({
        "name": name,
        "streak": 0,
        "points": 0
    })
    return {"message": "Habit added successfully"}