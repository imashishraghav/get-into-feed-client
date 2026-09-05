# GetIntoFeed Python FastAPI Backend

## Architecture
- **Framework**: FastAPI (Asynchronous Python REST API)
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Database**: PostgreSQL (Production) / SQLite (Zero-config local fallback)
- **Auth**: OAuth2 Password Bearer with JWT & bcrypt password hashing

## Quick Start
```bash
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```
Interactive API Docs will be available at `http://localhost:8000/docs`.
