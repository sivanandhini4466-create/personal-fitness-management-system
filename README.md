 # Personal Fitness Management System

A minimal full-stack app with **React (Vite)** frontend and **FastAPI (Python)** backend.

## Features
- Add, edit, delete workouts (date, type, duration, calories, notes)
- Profile (name, height, weight, goal)
- Simple stats (total workouts/minutes/calories, breakdown by type)
- SQLite storage; no setup required
- Clean, responsive UI

---

## Quick Start

### 1) Backend
```bash
cd backend
python -m venv .venv
# Activate: Windows PowerShell -> .venv\Scripts\Activate.ps1 | macOS/Linux -> source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
Backend runs at http://localhost:8000

### 2) Frontend
```bash
cd frontend
# Node.js 18+ required
npm install
npm run dev
```
Frontend runs at http://localhost:5173 and proxies API requests to the backend.

---

## API
- `GET /api/health` – service check
- `GET /api/workouts` – list
- `POST /api/workouts` – create
- `PUT /api/workouts/{id}` – update
- `DELETE /api/workouts/{id}` – delete
- `GET /api/stats` – totals + by type
- `GET /api/profile` – read profile
- `PUT /api/profile` – update profile

---

## Notes
- Database file `fitness.db` is created automatically in `/backend`.
- To build the frontend for production: `npm run build` (outputs `dist/`).
- To deploy, host the frontend as static files (e.g., Nginx) and run the FastAPI app with Uvicorn/Gunicorn.
