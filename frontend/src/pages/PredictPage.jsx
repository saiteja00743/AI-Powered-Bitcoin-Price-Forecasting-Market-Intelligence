import { useState } from 'react';
import PredictionCard from '../components/PredictionCard';
import { usePredict, usePredictionHistory, useMarketData } from '../hooks/useData';

const FIELDS = [
  { key: 'open', label: 'Open Price', placeholder: '40022', icon: '📂' },
  { key: 'high', label: '24h High', placeholder: '40246', icon: '📈' },
  { key: 'low', label: '24h Low', placeholder: '40010', icon: '📉' },
  { key: 'adj_close', label: 'Adj. Close', placeholder: '40126', icon: '💰' },
  { key: 'volume', label: 'Volume', placeholder: '22263900160', icon: '📊' },
];

export default function PredictPage() {
  const { data: market } = useMarketData(60000);
  const { result, loading, error, predict } = usePredict();
  const { addEntry } = usePredictionHistory();

  const [form, setForm] = useState({
    open: '',
    high: '',
    low: '',
    adj_close: '',
    volume: '',
  });

  const autofill = () => {
    if (!market) return;
    setForm({
      open: (market.current_price * 0.998).toFixed(2),
      high: market.high_24h.toFixed(2),
      low: market.low_24h.toFixed(2),
      adj_close: market.current_price.toFixed(2),
      volume: market.total_volume.toFixed(0),
    });
  };

  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = {};
    for (const f of FIELDS) {
      const v = parseFloat(form[f.key]);
      if (isNaN(v)) return;
      parsed[f.key] = v;
    }
    await predict(parsed);
    // result is set asynchronously, so we'll save in a useEffect-like pattern via callback
  };

  // Save to history when result changes
  const [lastResultId, setLastResultId] = useState(null);
  if (result && result !== lastResultId) {
    setLastResultId(result);
    addEntry({
      ...form,
      prediction: result.prediction,
      trend: result.trend,
      confidence: result.confidence,
    });
  }

  const isFormValid = FIELDS.every((f) => form[f.key] !== '' && !isNaN(parseFloat(form[f.key])));

  return (
    <div className="pt-20 pb-16 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">IBM AutoAI Model</p>
          <h1 className="text-4xl font-black text-white mb-2">Bitcoin <span className="gradient-text">Price Prediction</span></h1>
          <p className="text-gray-400">Enter OHLCV market data to get an AI-powered closing price forecast.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input form */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Market Data Input</h2>
              {market && (
                <button
                  type="button"
                  onClick={autofill}
                  className="btn-ghost text-sm px-3 py-2"
                >
                  ⚡ Auto-fill Live
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    <span className="mr-1.5">{field.icon}</span>
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="input-dark"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              ))}

              {error && (
                <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-3 text-accent-red text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="btn-btc w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Analyzing with IBM AutoAI...
                  </>
                ) : (
                  <>🔮 Predict Closing Price</>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-4 p-3 bg-dark-700/40 rounded-xl border border-white/5">
              <p className="text-gray-500 text-xs leading-relaxed">
                🤖 Powered by <span className="text-btc-orange font-semibold">IBM AutoAI</span> —
                a time-series forecasting model trained on historical BTC/USD OHLCV data.
                In development mode, a realistic mock predictor is used.
              </p>
            </div>
          </div>

          {/* Result */}
          <div className="space-y-6">
            <PredictionCard
              result={result}
              loading={loading}
              currentPrice={market?.current_price}
            />

            {result && (
              <div className="glass-card p-6 animate-slide-up">
                <p className="section-label mb-3">What This Means</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {result.trend === 'Bullish' ? '📈' : result.trend === 'Bearish' ? '📉' : '➡️'}
                    </span>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {result.trend === 'Bullish'
                          ? 'Bullish Signal — Potential Upward Move'
                          : result.trend === 'Bearish'
                          ? 'Bearish Signal — Potential Downward Move'
                          : 'Neutral — No Clear Direction'}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Model confidence: {result.confidence}%
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    ⚠️ <em>This is not financial advice. Cryptocurrency markets are highly volatile.
                    Always do your own research and consider your risk tolerance before investing.</em>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
