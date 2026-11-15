from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from services.api.routes.auth import router as auth_router
from services.api.routes.research import router as research_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Startup Idea Research Agent API",
    description="Backend API with 2-Factor Authentication and Research Pipeline",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(research_router)
@app.get("/health")
async def health_check():
    return {"status":"ok", "service":"Startup Idea Research Agent API is running."}
