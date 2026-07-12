# TransitOps Backend

## Overview
This backend provides authentication and role-aware API endpoints for the TransitOps frontend.

## Requirements
- Python 3.11+
- PostgreSQL
- FastAPI
- SQLAlchemy 2.x
- Alembic

## Windows PowerShell setup

### 1. Create and activate a virtual environment
```powershell
cd C:\Odoo-July-26\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Install dependencies
```powershell
pip install -r requirements.txt
```

### 3. Create PostgreSQL database
```powershell
psql -U postgres -c "CREATE DATABASE \"TransitOps\";"
```

### 4. Create .env from .env.example
```powershell
Copy-Item .env.example .env
```

### 5. Run Alembic migrations
```powershell
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

### 6. Create first administrator
```powershell
$env:ADMIN_PASSWORD = 'ChangeMe123!'
python -m app.scripts.create_admin
```

### 7. Start the API server
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
