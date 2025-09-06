from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sqlite3
from datetime import datetime

DB_PATH = "fitness.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        '''
        CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL,
            calories INTEGER DEFAULT 0,
            notes TEXT
        )
        '''
    )
    cur.execute(
        '''
        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            name TEXT DEFAULT 'You',
            height_cm REAL,
            weight_kg REAL,
            goal TEXT
        )
        '''
    )
    cur.execute("INSERT OR IGNORE INTO profile (id, name) VALUES (1, 'You')")
    conn.commit()
    conn.close()

class WorkoutIn(BaseModel):
    date: str = Field(..., description="ISO date e.g. 2025-09-05")
    type: str
    duration_minutes: int = Field(..., ge=1)
    calories: int = Field(0, ge=0)
    notes: Optional[str] = None

class Workout(WorkoutIn):
    id: int

class Profile(BaseModel):
    name: str = "You"
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    goal: Optional[str] = None

app = FastAPI(title="Fitness Manager API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}

@app.get("/api/workouts", response_model=List[Workout])
def list_workouts():
    conn = get_conn()
    cur = conn.cursor()
    rows = cur.execute("SELECT * FROM workouts ORDER BY date DESC, id DESC").fetchall()
    conn.close()
    return [Workout(**dict(r)) for r in rows]

@app.post("/api/workouts", response_model=Workout, status_code=201)
def add_workout(w: WorkoutIn):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO workouts (date, type, duration_minutes, calories, notes) VALUES (?, ?, ?, ?, ?)",
        (w.date, w.type, w.duration_minutes, w.calories, w.notes)
    )
    conn.commit()
    new_id = cur.lastrowid
    row = cur.execute("SELECT * FROM workouts WHERE id = ?", (new_id,)).fetchone()
    conn.close()
    return Workout(**dict(row))

@app.put("/api/workouts/{workout_id}", response_model=Workout)
def update_workout(workout_id: int, w: WorkoutIn):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "UPDATE workouts SET date=?, type=?, duration_minutes=?, calories=?, notes=? WHERE id=?",
        (w.date, w.type, w.duration_minutes, w.calories, w.notes, workout_id)
    )
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Workout not found")
    conn.commit()
    row = cur.execute("SELECT * FROM workouts WHERE id = ?", (workout_id,)).fetchone()
    conn.close()
    return Workout(**dict(row))

@app.delete("/api/workouts/{workout_id}", status_code=204)
def delete_workout(workout_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM workouts WHERE id = ?", (workout_id,))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Workout not found")
    conn.commit()
    conn.close()
    return

@app.get("/api/stats")
def stats():
    conn = get_conn()
    cur = conn.cursor()
    total = cur.execute("SELECT COUNT(*) AS cnt FROM workouts").fetchone()["cnt"]
    minutes = cur.execute("SELECT IFNULL(SUM(duration_minutes),0) AS mins FROM workouts").fetchone()["mins"]
    calories = cur.execute("SELECT IFNULL(SUM(calories),0) AS cal FROM workouts").fetchone()["cal"]
    by_type = cur.execute("SELECT type, COUNT(*) AS cnt FROM workouts GROUP BY type").fetchall()
    conn.close()
    return {
        "total_workouts": total,
        "total_minutes": minutes,
        "total_calories": calories,
        "by_type": [{ "type": r["type"], "count": r["cnt"] } for r in by_type]
    }

@app.get("/api/profile", response_model=Profile)
def get_profile():
    conn = get_conn()
    cur = conn.cursor()
    row = cur.execute("SELECT name, height_cm, weight_kg, goal FROM profile WHERE id = 1").fetchone()
    conn.close()
    return Profile(**dict(row))

@app.put("/api/profile", response_model=Profile)
def update_profile(p: Profile):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "UPDATE profile SET name=?, height_cm=?, weight_kg=?, goal=? WHERE id = 1",
        (p.name, p.height_cm, p.weight_kg, p.goal)
    )
    conn.commit()
    row = cur.execute("SELECT name, height_cm, weight_kg, goal FROM profile WHERE id = 1").fetchone()
    conn.close()
    return Profile(**dict(row))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
