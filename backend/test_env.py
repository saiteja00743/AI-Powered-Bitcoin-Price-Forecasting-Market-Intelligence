"""
Quick env/credentials checker for Bitcoin Edunet backend.
Run: python test_env.py
"""
import asyncio, os, sys
from dotenv import load_dotenv

load_dotenv()

IBM_API_KEY   = os.getenv("IBM_API_KEY", "")
IBM_SCORING_URL = os.getenv("IBM_SCORING_URL", "")
OPENAI_API_KEY  = os.getenv("OPENAI_API_KEY", "")
COINGECKO_KEY   = os.getenv("COINGECKO_API_KEY", "")

print("=" * 60)
print("  ENV VARIABLE CHECK")
print("=" * 60)

def status(name, value, mock_val="mock"):
    is_set = bool(value) and value != mock_val
    icon = "OK" if is_set else "MISSING"
    masked = value[:8] + "..." + value[-4:] if len(value) > 12 else value
    print(f"  [{icon}]  {name:25s} {'SET  -> ' + masked if is_set else 'NOT SET / MOCK'}")

status("IBM_API_KEY",      IBM_API_KEY)
status("IBM_SCORING_URL",  IBM_SCORING_URL, mock_val="mock")
status("OPENAI_API_KEY",   OPENAI_API_KEY)
status("COINGECKO_API_KEY",COINGECKO_KEY,   mock_val="mock")

print()


async def test_ibm():
    print("-" * 60)
    print("  TESTING: IBM IAM Token")
    print("-" * 60)
    if not IBM_API_KEY or IBM_API_KEY == "mock":
        print("  [SKIP]  IBM_API_KEY not set.")
        return

    import httpx
    token = None
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://iam.cloud.ibm.com/identity/token",
                data={
                    "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                    "apikey": IBM_API_KEY,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=10,
            )
            resp.raise_for_status()
            token = resp.json().get("access_token", "")
            print(f"  [PASS]  IBM IAM Token obtained ({token[:20]}...)")
    except Exception as e:
        print(f"  [FAIL]  IBM IAM Token FAILED: {e}")
        return

    print("  TESTING: IBM Scoring Endpoint")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                IBM_SCORING_URL,
                json={
                    "input_data": [{
                        "fields": ["Open","High","Low","Close","Adj Close","Volume"],
                        "values": [[60000, 61000, 59000, 60500, 60500, 30000000000]]
                    }]
                },
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
                timeout=15,
            )
            resp.raise_for_status()
            result = resp.json()
            raw = result["predictions"][0]["values"][0][0]
            # IBM may return a list or a scalar
            prediction = raw[0] if isinstance(raw, list) else raw
            print(f"  [PASS]  IBM Scoring OK  ->  Predicted price: ${float(prediction):,.2f}")
            print(f"          Raw IBM response: {result['predictions'][0]['values']}")
    except Exception as e:
        print(f"  [FAIL]  IBM Scoring FAILED: {e}")


async def test_openai():
    print("-" * 60)
    print("  TESTING: OpenAI API Key")
    print("-" * 60)
    if not OPENAI_API_KEY or OPENAI_API_KEY == "mock":
        print("  [SKIP]  OPENAI_API_KEY not set.")
        return
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://api.openai.com/v1/models",
                headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                timeout=10,
            )
            resp.raise_for_status()
            models = [m["id"] for m in resp.json().get("data", [])[:3]]
            print(f"  [PASS]  OpenAI key valid  ->  Sample models: {models}")
    except Exception as e:
        print(f"  [FAIL]  OpenAI FAILED: {e}")


async def test_coingecko():
    print("-" * 60)
    print("  TESTING: CoinGecko API Key")
    print("-" * 60)
    import httpx
    try:
        headers = {}
        if COINGECKO_KEY and COINGECKO_KEY != "mock":
            headers["x-cg-pro-api-key"] = COINGECKO_KEY
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
                headers=headers,
                timeout=10,
            )
            resp.raise_for_status()
            btc_price = resp.json().get("bitcoin", {}).get("usd", "N/A")
            print(f"  [PASS]  CoinGecko OK  ->  BTC price: ${btc_price:,}")
    except Exception as e:
        print(f"  [FAIL]  CoinGecko FAILED: {e}")


async def main():
    await test_ibm()
    print()
    await test_openai()
    print()
    await test_coingecko()
    print()
    print("=" * 60)
    print("  CHECK COMPLETE")
    print("=" * 60)

asyncio.run(main())
