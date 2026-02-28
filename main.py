from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Habit Tracker Backend running"}