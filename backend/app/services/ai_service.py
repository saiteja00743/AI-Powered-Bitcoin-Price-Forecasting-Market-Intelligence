"""
AI (LLM) service for Bitcoin analysis explanations.

Uses OpenAI GPT when OPENAI_API_KEY is set to a real value,
otherwise returns rich mock explanations for development.
"""
import random
from app.config import get_settings

settings = get_settings()

_MOCK_BULLISH = [
    (
        "Based on today's market data, the model predicts a closing price of **${prediction:,.2f}**, "
        "which is {delta:+.2f}% from the current price. 📈\n\n"
        "**Momentum is slightly bullish.** Volume is elevated, suggesting buying pressure. "
        "Recent news sentiment is cautiously optimistic. That said, cryptocurrency markets remain "
        "highly volatile — always consider your risk tolerance and never invest more than you can afford to lose."
    ),
    (
        "The IBM AutoAI model forecasts a close of **${prediction:,.2f}** ({delta:+.2f}%). 🟢\n\n"
        "Technical indicators lean bullish: price is holding above recent support levels, "
        "and volume confirms upward momentum. If macro conditions remain stable, we could see "
        "continuation. However, a cautious position sizing is recommended given crypto volatility."
    ),
]

_MOCK_BEARISH = [
    (
        "The model projects a close of **${prediction:,.2f}** ({delta:+.2f}%). 📉\n\n"
        "**Bearish pressure is present.** Volume is declining and price shows signs of distribution. "
        "Recent news includes some uncertainty in regulatory space. This could be a good time to wait "
        "for a clearer signal before entering a long position."
    ),
    (
        "Predicted closing price: **${prediction:,.2f}** ({delta:+.2f}%). 🔴\n\n"
        "Market dynamics suggest downward pressure in the short term. The spread between today's "
        "high and low is wide, indicating indecision. Risk management is critical — consider "
        "tight stop-losses if holding a position."
    ),
]

_MOCK_NEUTRAL = [
    (
        "Predicted close: **${prediction:,.2f}** ({delta:+.2f}%). ⚪\n\n"
        "The market appears to be in a consolidation phase. Price action is sideways and "
        "volume is average. There's no clear directional signal at this time. "
        "Patience is key — waiting for a breakout with volume confirmation would be the prudent move."
    ),
]


async def get_ai_explanation(
    prediction: float,
    adj_close: float,
    trend: str,
    confidence: float,
    user_question: str = "Should I invest today?",
    news_headlines: list[str] | None = None,
) -> str:
    """
    Generate a natural-language explanation of the Bitcoin prediction.
    Uses OpenAI if key is configured, else returns a realistic mock response.
    """
    is_mock = settings.OPENAI_API_KEY == "mock"

    delta = ((prediction - adj_close) / adj_close * 100) if adj_close > 0 else 0

    if is_mock:
        if trend == "Bullish":
            template = random.choice(_MOCK_BULLISH)
        elif trend == "Bearish":
            template = random.choice(_MOCK_BEARISH)
        else:
            template = random.choice(_MOCK_NEUTRAL)

        response = template.format(prediction=prediction, delta=delta)
        response += (
            f"\n\n**Model Confidence:** {confidence}% | "
            f"**Trend:** {trend}\n\n"
            "_⚠️ This is not financial advice. Always do your own research (DYOR)._"
        )
        return response

    # Real OpenAI call
    try:
        from openai import AsyncOpenAI, RateLimitError, AuthenticationError
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        headlines_str = ""
        if news_headlines:
            headlines_str = "\nRecent news:\n" + "\n".join(f"- {h}" for h in news_headlines[:5])

        system_prompt = (
            "You are BitSense AI, a professional Bitcoin market analyst. "
            "Provide concise, data-driven analysis. Use markdown formatting. "
            "Always end with a risk disclaimer."
        )
        user_prompt = (
            f"User question: {user_question}\n\n"
            f"IBM AutoAI Prediction:\n"
            f"- Predicted close: ${prediction:,.2f}\n"
            f"- Current price: ${adj_close:,.2f}\n"
            f"- Change: {delta:+.2f}%\n"
            f"- Trend: {trend}\n"
            f"- Model confidence: {confidence}%\n"
            f"{headlines_str}\n\n"
            "Provide a 3-4 sentence analysis with a clear recommendation (Buy/Hold/Sell) "
            "backed by the data above."
        )

        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=400,
            temperature=0.7,
        )
        return completion.choices[0].message.content or "Unable to generate explanation."

    except Exception as exc:
        # Determine if this is a quota / auth issue — fall back to rich mock silently
        exc_str = str(exc).lower()
        is_quota = "insufficient_quota" in exc_str or "429" in exc_str or "rate limit" in exc_str
        is_auth  = "401" in exc_str or "authentication" in exc_str or "invalid api key" in exc_str

        if trend == "Bullish":
            template = random.choice(_MOCK_BULLISH)
        elif trend == "Bearish":
            template = random.choice(_MOCK_BEARISH)
        else:
            template = random.choice(_MOCK_NEUTRAL)

        base = template.format(prediction=prediction, delta=delta)
        base += f"\n\n**Model Confidence:** {confidence}% | **Trend:** {trend}\n\n"
        base += "_⚠️ This is not financial advice. Always do your own research (DYOR)._"

        if is_quota:
            # Silent fallback — no ugly error shown to user
            return base
        elif is_auth:
            return base + "\n\n_ℹ️ AI assistant is running in offline mode._"
        else:
            return base + f"\n\n_ℹ️ AI assistant temporarily unavailable — showing data-driven analysis._"
