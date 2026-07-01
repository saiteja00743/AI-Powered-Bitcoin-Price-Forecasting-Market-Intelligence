"""
News service — fetches crypto news from CoinGecko (free) or CryptoPanic.
"""
import httpx
from datetime import datetime
from app.config import get_settings

settings = get_settings()

COINGECKO_NEWS_URL = "https://api.coingecko.com/api/v3/news"
CRYPTOPANIC_URL = "https://cryptopanic.com/api/v1/posts/"


def _classify_sentiment(title: str) -> str:
    """Simple keyword-based sentiment classification."""
    title_lower = title.lower()
    bullish_words = [
        "surge", "rally", "bull", "gain", "rise", "soar", "high", "breakout",
        "adoption", "launch", "record", "beat", "pump", "grow", "positive",
    ]
    bearish_words = [
        "crash", "drop", "fall", "bear", "dump", "loss", "ban", "hack",
        "fraud", "scam", "concern", "fear", "plunge", "decline", "negative",
    ]
    bullish_score = sum(1 for w in bullish_words if w in title_lower)
    bearish_score = sum(1 for w in bearish_words if w in title_lower)

    if bullish_score > bearish_score:
        return "positive"
    elif bearish_score > bullish_score:
        return "negative"
    return "neutral"


async def fetch_news(limit: int = 10) -> list[dict]:
    """Fetch latest Bitcoin/crypto news."""
    # Try CryptoPanic first if API key is set
    if settings.CRYPTOPANIC_API_KEY != "mock":
        try:
            return await _fetch_cryptopanic(limit)
        except Exception:
            pass

    # Fall back to CoinGecko news
    try:
        return await _fetch_coingecko_news(limit)
    except Exception:
        return _get_mock_news(limit)


async def _fetch_coingecko_news(limit: int) -> list[dict]:
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            COINGECKO_NEWS_URL,
            headers={"accept": "application/json"},
        )
        resp.raise_for_status()
        data = resp.json()
        articles = data.get("data", [])[:limit]
        return [
            {
                "title": a.get("title", ""),
                "url": a.get("url", ""),
                "source": a.get("news_site", "CoinGecko"),
                "published_at": a.get("updated_at", ""),
                "sentiment": _classify_sentiment(a.get("title", "")),
                "thumbnail": a.get("thumb_2x", ""),
            }
            for a in articles
        ]


async def _fetch_cryptopanic(limit: int) -> list[dict]:
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            CRYPTOPANIC_URL,
            params={
                "auth_token": settings.CRYPTOPANIC_API_KEY,
                "currencies": "BTC",
                "kind": "news",
                "public": "true",
            },
        )
        resp.raise_for_status()
        results = resp.json().get("results", [])[:limit]
        return [
            {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "source": r.get("source", {}).get("title", "CryptoPanic"),
                "published_at": r.get("published_at", ""),
                "sentiment": r.get("votes", {}).get("positive", 0) > r.get("votes", {}).get("negative", 0)
                    and "positive" or "neutral",
                "thumbnail": "",
            }
            for r in results
        ]


def _get_mock_news(limit: int) -> list[dict]:
    mock_articles = [
        {"title": "Bitcoin Surges Past $67K as Institutional Demand Grows", "sentiment": "positive", "source": "CoinDesk"},
        {"title": "BlackRock Bitcoin ETF Sees Record $500M Inflow", "sentiment": "positive", "source": "Bloomberg"},
        {"title": "Fed Rate Decision Could Impact Crypto Markets This Week", "sentiment": "neutral", "source": "Reuters"},
        {"title": "Bitcoin Miners Prepare for Next Halving Cycle", "sentiment": "positive", "source": "The Block"},
        {"title": "Crypto Exchange Volumes Rise 30% in Q2 2024", "sentiment": "positive", "source": "CryptoSlate"},
        {"title": "Regulatory Clarity Expected as SEC Reviews Crypto Guidelines", "sentiment": "neutral", "source": "Forbes"},
        {"title": "Bitcoin Network Hash Rate Hits All-Time High", "sentiment": "positive", "source": "Blockstream"},
        {"title": "Analysts Warn of Short-Term Correction After Recent Rally", "sentiment": "negative", "source": "CoinTelegraph"},
        {"title": "El Salvador Expands Bitcoin Adoption Program", "sentiment": "positive", "source": "BBC"},
        {"title": "Macro Uncertainty Weighs on Crypto Sentiment", "sentiment": "negative", "source": "CNBC"},
    ]
    return [
        {
            **a,
            "url": "https://coindesk.com",
            "published_at": datetime.utcnow().isoformat(),
            "thumbnail": "",
        }
        for a in mock_articles[:limit]
    ]
