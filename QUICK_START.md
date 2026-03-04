## VidyāMitra Quick Start

This guide walks you through setting up and running the **VidyāMitra – The Intelligent Career Agent** locally.

---

### 1. Prerequisites

- **Python** 3.10 or later
- **Node.js** 18 or later (npm 9+)
- **VS Code** (recommended IDE)

---

### 2. Project Layout

The repository is organized as:

- `backend/` – FastAPI backend
- `web/` – React + Vite frontend

Backend and frontend are fully decoupled and communicate only via HTTP APIs.

---

### 3. Backend Setup (FastAPI)

From the project root:

```bash
cd backend
```

#### 3.1. Create and activate virtual environment

```bash
python -m venv .venv
```

- **Windows PowerShell**:

```bash
.venv\Scripts\Activate
```

- **macOS / Linux**:

```bash
source .venv/bin/activate
```

All backend commands below assume the virtual environment is active.

#### 3.2. Install dependencies

```bash
pip install -r requirements.txt
```

#### 3.3. Configure backend environment variables

Copy `.env.example` to `.env` (if not already present) and fill in your keys:

```bash
cp .env.example .env  # on Windows PowerShell use: copy .env.example .env
```

Required variables:

- `OPENAI_API_KEY`
- `GOOGLE_API_KEY`
- `YOUTUBE_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `PEXELS_API_KEY`
- `NEWS_API_KEY`
- `EXCHANGE_API_KEY`
- `JWT_SECRET`

#### 3.4. Run the backend server

From `backend/`:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Open the automatic API docs:

- Swagger UI: `http://127.0.0.1:8000/docs`

---

### 4. Frontend Setup (React + Vite)

From the project root:

```bash
cd web
```

#### 4.1. Install dependencies

```bash
npm install
```

#### 4.2. Configure frontend environment variables

Create `web/.env` with:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

#### 4.3. Run the frontend dev server

```bash
npm run dev
```

Open the UI:

- Frontend: `http://localhost:5173`

---

### 5. Authentication & Basic Flow

1. Register a new user via the UI or `/auth/register` endpoint.  
2. Log in to obtain a JWT access token.  
3. The frontend stores the token and attaches it to subsequent API requests.  
4. Access protected routes such as dashboards, resume parsing, quizzes, and progress tracking.

---

### 6. Manual Testing Workflow

- **Backend (Postman / HTTP client)**:
  - Test `/auth/register` and `/auth/login`
  - Test `/resume/parse`, `/training/plan`, `/quiz/session`, `/interview/mock`, `/jobs/recommendations`, `/progress/overview`

- **Frontend**:
  - Verify login / logout, redirects, and protected routes
  - Upload a resume and view parsed results
  - Navigate training plan, quizzes, mock interviews, and progress dashboard

- **Integration Flow**:
  1. Login
  2. Upload resume
  3. View training plan
  4. Take quiz
  5. Inspect progress dashboard

This establishes the core foundation for the VidyāMitra platform.

