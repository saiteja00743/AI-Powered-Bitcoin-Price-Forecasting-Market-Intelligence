import { useEffect, useRef, useState } from 'react';

export default function PredictionCard({ result, loading, currentPrice }) {
  const [animatedConf, setAnimatedConf] = useState(0);

  useEffect(() => {
    if (result?.confidence) {
      setAnimatedConf(0);
      const t = setTimeout(() => setAnimatedConf(result.confidence), 100);
      return () => clearTimeout(t);
    }
  }, [result?.confidence]);

  const formatPrice = (p) =>
    p ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(p) : '--';

  const delta = result && currentPrice ? ((result.prediction - currentPrice) / currentPrice * 100) : null;

  const trendClass = {
    Bullish: 'trend-bullish',
    Bearish: 'trend-bearish',
    Neutral: 'trend-neutral',
  }[result?.trend] || 'trend-neutral';

  const trendIcon = { Bullish: '📈', Bearish: '📉', Neutral: '➡️' }[result?.trend] || '➡️';

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-4 w-28 mb-4 rounded" />
        <div className="skeleton h-10 w-40 mb-3 rounded" />
        <div className="skeleton h-2 w-full mb-4 rounded" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="text-5xl mb-4 animate-float">🔮</div>
        <p className="text-gray-400 font-medium">No prediction yet</p>
        <p className="text-gray-600 text-sm mt-1">Enter OHLCV data to get a prediction</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-slide-up">
      <p className="section-label mb-4">AI Prediction</p>

      {/* Predicted price */}
      <p className="text-3xl font-bold font-mono gradient-text mb-1">
        {formatPrice(result.prediction)}
      </p>

      {delta !== null && (
        <p className={`text-sm font-semibold mb-4 ${delta >= 0 ? 'price-up' : 'price-down'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}% from current
        </p>
      )}

      {/* Confidence bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-gray-500 text-xs">Model Confidence</p>
          <p className="text-btc-orange font-semibold text-sm">{result.confidence}%</p>
        </div>
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${animatedConf}%` }}
          />
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2">
        <span className={trendClass}>
          {trendIcon} {result.trend}
        </span>
        {result.warning && (
          <span className="text-yellow-500 text-xs">⚠️ Mock mode</span>
        )}
      </div>

      {/* Predicted vs current */}
      {currentPrice && (
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
          <div>
            <p className="text-gray-500 text-xs mb-0.5">Current</p>
            <p className="text-white font-mono font-semibold text-sm">{formatPrice(currentPrice)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-0.5">Predicted Close</p>
            <p className="text-btc-orange font-mono font-semibold text-sm">{formatPrice(result.prediction)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
