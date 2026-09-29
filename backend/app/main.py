"""
REASONKEEP — Institutional Memory for University Engineering & Research Teams
Backend entrypoint — FastAPI application (Module 2: Hindsight Integration)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.assistant import router as assistant_router
from app.api.drift import router as drift_router
from app.api.ingestion import router as ingestion_router
from app.api.memory import router as memory_router
from app.api.trace import router as trace_router
from app.config import settings

app = FastAPI(
    title="REASONKEEP API",
    description="Institutional Memory for University Engineering & Research Teams",
    version="0.6.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS — allow frontend dev server during development
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=list({settings.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"}),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(memory_router)
app.include_router(ingestion_router)
app.include_router(assistant_router)
app.include_router(trace_router)
app.include_router(drift_router)


# ---------------------------------------------------------------------------
# Core routes
# ---------------------------------------------------------------------------

@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint.
    Returns service status, name, and current version.
    """
    return {
        "status": "ok",
        "service": "reasonkeep-api",
        "version": "0.6.0",
    }
