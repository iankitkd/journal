## Journal App

A full-stack journal application with:

- A FastAPI backend for journal entry storage, LLM-powered emotion analysis, and aggregate insights
- A React + Vite frontend for writing entries, viewing history, and exploring trends
- PostgreSQL-backed persistence for entries and their saved analysis results


## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL
- LLM provider: Groq

## Project Structure

```text
backend/
  app/
    api/          FastAPI route handlers
    db/           SQLAlchemy models and session setup
    schemas/      Pydantic request/response models
    services/     Reusable business logic such as text analysis
frontend/
  src/
    api/          Frontend API calls
    components/   UI components
```

## Backend Setup

Create `backend/.env` with:

```env
ARVYAX_DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/arvyax_journal
ARVYAX_GROQ_API_KEY=your_api_key_here
ARVYAX_LLM_MODEL=your_model_here
```

Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn app.main:app --reload
```

The backend starts on `http://localhost:8000`.

## Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend starts on `http://localhost:5173`.

## Main API Endpoints

- `POST /api/journal` creates a journal entry and stores its analysis
- `POST /api/journal/analyze` runs analysis without saving an entry
- `GET /api/journal/{user_id}` returns saved entries for a user
- `GET /api/journal/insights/{user_id}` returns aggregate insights for a user
- `GET /health` returns a simple health response