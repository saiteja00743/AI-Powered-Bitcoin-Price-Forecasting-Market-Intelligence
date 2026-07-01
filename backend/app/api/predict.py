from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ibm_service import predict_bitcoin

router = APIRouter()


class PredictRequest(BaseModel):
    open: float
    high: float
    low: float
    adj_close: float
    volume: float


class PredictResponse(BaseModel):
    prediction: float
    confidence: float
    trend: str
    warning: str | None = None


@router.post("/predict", response_model=PredictResponse, tags=["Prediction"])
async def predict(req: PredictRequest):
    """
    Predict Bitcoin closing price using IBM AutoAI model.

    - **open**: Opening price
    - **high**: Daily high
    - **low**: Daily low
    - **adj_close**: Adjusted closing price
    - **volume**: Trading volume
    """
    result = await predict_bitcoin(
        open_=req.open,
        high=req.high,
        low=req.low,
        adj_close=req.adj_close,
        volume=req.volume,
    )
    return PredictResponse(**result)
