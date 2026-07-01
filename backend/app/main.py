"""
BitSense AI — FastAPI Backend
Main application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api import predict, market, news, chat

settings = get_settings()

app = FastAPI(
    title="BitSense AI API",
    description=(
        "AI-Powered Bitcoin Forecasting Assistant. "
        "Provides prediction, market data, news, and AI chat endpoints."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───────────────────────────────────────────────────────────────────
app.include_router(predict.router, prefix="/api")
app.include_router(market.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "BitSense AI API is running 🚀",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": [
            "GET  /api/market",
            "GET  /api/news",
            "POST /api/predict",
            "POST /api/chat",
        ],
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
