import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()

COINGECKO_BASE = "https://api.coingecko.com/api/v3"


@router.get("/market", tags=["Market Data"])
async def get_market_data():
    """
    Fetch live Bitcoin market data from CoinGecko (free, no API key required).
    Returns current price, 24h high/low, volume, market cap, and price change.
    """
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{COINGECKO_BASE}/coins/markets",
                params={
                    "vs_currency": "usd",
                    "ids": "bitcoin",
                    "order": "market_cap_desc",
                    "per_page": 1,
                    "page": 1,
                    "sparkline": True,
                    "price_change_percentage": "1h,24h,7d",
                },
                headers={"accept": "application/json"},
            )
            resp.raise_for_status()
            data = resp.json()[0]

        return {
            "id": data["id"],
            "symbol": data["symbol"].upper(),
            "name": data["name"],
            "current_price": data["current_price"],
            "market_cap": data["market_cap"],
            "total_volume": data["total_volume"],
            "high_24h": data["high_24h"],
            "low_24h": data["low_24h"],
            "price_change_24h": data["price_change_24h"],
            "price_change_percentage_24h": data["price_change_percentage_24h"],
            "price_change_percentage_1h": data.get("price_change_percentage_1h_in_currency"),
            "price_change_percentage_7d": data.get("price_change_percentage_7d_in_currency"),
            "circulating_supply": data["circulating_supply"],
            "ath": data["ath"],
            "ath_change_percentage": data["ath_change_percentage"],
            "sparkline": data.get("sparkline_in_7d", {}).get("price", []),
            "image": data["image"],
            "last_updated": data["last_updated"],
        }
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"CoinGecko API error: {exc}")
    except (KeyError, IndexError) as exc:
        raise HTTPException(status_code=502, detail=f"Unexpected response format: {exc}")
