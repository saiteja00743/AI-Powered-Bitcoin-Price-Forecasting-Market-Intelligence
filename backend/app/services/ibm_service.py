"""
IBM AutoAI Bitcoin prediction service.

When IBM_API_KEY and IBM_SCORING_URL are set to real values,
this service calls the actual scoring endpoint.
Otherwise, it uses a realistic mock predictor based on OHLCV data.
"""
import httpx
import random
import math
from app.config import get_settings

settings = get_settings()


async def get_ibm_token() -> str:
    """Fetch IAM token from IBM Cloud."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://iam.cloud.ibm.com/identity/token",
            data={
                "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                "apikey": settings.IBM_API_KEY,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()["access_token"]


def _mock_predict(open_: float, high: float, low: float, adj_close: float, volume: float) -> dict:
    """
    Realistic mock predictor using a simple OHLCV heuristic.
    Simulates what a trained AutoAI model might produce.
    """
    # Weighted blend of OHLC as a 'fair value' estimate
    fair_value = (open_ * 0.2 + high * 0.25 + low * 0.25 + adj_close * 0.3)

    # Volume-based momentum: higher volume = stronger move
    vol_factor = math.log10(max(volume, 1)) / 30
    noise = random.uniform(-0.004, 0.004)  # ±0.4% noise

    predicted = fair_value * (1 + vol_factor * 0.01 + noise)

    # Confidence: based on spread between high/low relative to price
    spread_pct = (high - low) / adj_close if adj_close > 0 else 0
    confidence = max(55.0, min(96.0, 90.0 - spread_pct * 200))

    # Trend
    if predicted > adj_close * 1.002:
        trend = "Bullish"
    elif predicted < adj_close * 0.998:
        trend = "Bearish"
    else:
        trend = "Neutral"

    return {
        "prediction": round(predicted, 2),
        "confidence": round(confidence, 1),
        "trend": trend,
    }


async def predict_bitcoin(open_: float, high: float, low: float, adj_close: float, volume: float, close_: float | None = None) -> dict:
    """
    Main prediction function.
    Uses real IBM endpoint if credentials are set, otherwise mock.
    """
    is_mock = settings.IBM_API_KEY == "mock" or settings.IBM_SCORING_URL == "mock"

    if is_mock:
        return _mock_predict(open_, high, low, adj_close, volume)

    # Real IBM AutoAI call
    try:
        token = await get_ibm_token()
        close = close_ if close_ is not None else adj_close
        payload = {
            "input_data": [
                {
                    "fields": ["Open", "High", "Low", "Close", "Adj Close", "Volume"],
                    "values": [[open_, high, low, close, adj_close, volume]],
                }
            ]
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                settings.IBM_SCORING_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
                timeout=15,
            )
            resp.raise_for_status()
            result = resp.json()
            raw = result["predictions"][0]["values"][0][0]
            # IBM AutoAI returns [[[value]]] — unwrap to scalar
            raw_prediction = raw[0] if isinstance(raw, list) else raw

        # Build confidence/trend from prediction vs adj_close
        diff_pct = (raw_prediction - adj_close) / adj_close
        confidence = round(max(55.0, min(96.0, 85.0 - abs(diff_pct) * 100)), 1)
        if diff_pct > 0.002:
            trend = "Bullish"
        elif diff_pct < -0.002:
            trend = "Bearish"
        else:
            trend = "Neutral"

        return {
            "prediction": round(raw_prediction, 2),
            "confidence": confidence,
            "trend": trend,
        }
    except Exception as exc:
        # Fall back to mock if IBM call fails
        result = _mock_predict(open_, high, low, adj_close, volume)
        result["warning"] = f"IBM endpoint unavailable, using mock: {str(exc)}"
        return result
