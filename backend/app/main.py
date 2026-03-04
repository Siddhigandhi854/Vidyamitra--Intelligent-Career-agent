from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, resume, quiz, training, interview, jobs, progress, media, token_utils


app = FastAPI(
    title="VidyāMitra – The Intelligent Career Agent",
    version="0.1.0",
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:*",
    "http://127.0.0.1:*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict:
    return {"status": "ok", "message": "VidyāMitra backend is running."}


app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(quiz.router)
app.include_router(training.router)
app.include_router(interview.router)
app.include_router(jobs.router)
app.include_router(progress.router)
app.include_router(media.router)
app.include_router(token_utils.router)

