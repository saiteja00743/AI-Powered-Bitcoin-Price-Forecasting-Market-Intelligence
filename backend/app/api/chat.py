from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ibm_service import predict_bitcoin
from app.services.ai_service import get_ai_explanation
from app.services.news_service import fetch_news

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    open: float | None = None
    high: float | None = None
    low: float | None = None
    adj_close: float | None = None
    volume: float | None = None
    current_price: float | None = None


class ChatResponse(BaseModel):
    answer: str
    prediction: float | None = None
    trend: str | None = None
    confidence: float | None = None


@router.post("/chat", response_model=ChatResponse, tags=["AI Chat"])
async def chat(req: ChatRequest):
    """
    AI chat endpoint — answers user questions about Bitcoin using:
    1. IBM AutoAI prediction
    2. Live news context
    3. LLM explanation (GPT / mock)
    """
    # Use provided price data or sensible defaults (will produce a mock prediction)
    adj_close = req.adj_close or req.current_price or 40000.0
    open_ = req.open or adj_close * 0.998
    high = req.high or adj_close * 1.012
    low = req.low or adj_close * 0.988
    volume = req.volume or 22_000_000_000.0

    # Step 1: Get IBM prediction
    pred_result = await predict_bitcoin(
        open_=open_,
        high=high,
        low=low,
        adj_close=adj_close,
        volume=volume,
    )
    prediction = pred_result["prediction"]
    trend = pred_result["trend"]
    confidence = pred_result["confidence"]

    # Step 2: Fetch news headlines for context
    try:
        news = await fetch_news(limit=5)
        headlines = [a["title"] for a in news]
    except Exception:
        headlines = []

    # Step 3: Generate LLM explanation
    answer = await get_ai_explanation(
        prediction=prediction,
        adj_close=adj_close,
        trend=trend,
        confidence=confidence,
        user_question=req.question,
        news_headlines=headlines,
    )

    return ChatResponse(
        answer=answer,
        prediction=prediction,
        trend=trend,
        confidence=confidence,
    )
