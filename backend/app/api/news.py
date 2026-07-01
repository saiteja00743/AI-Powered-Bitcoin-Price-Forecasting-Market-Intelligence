from fastapi import APIRouter, Query
from app.services.news_service import fetch_news

router = APIRouter()


@router.get("/news", tags=["News"])
async def get_news(limit: int = Query(default=10, ge=1, le=30)):
    """
    Fetch latest Bitcoin/crypto news with sentiment classification.
    Returns a list of articles with title, source, URL, and sentiment (positive/negative/neutral).
    """
    articles = await fetch_news(limit=limit)
    return {"articles": articles, "count": len(articles)}
