import { usePredictionHistory } from '../hooks/useData';

function formatPrice(p) {
  if (!p) return '--';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(p);
}

function formatDate(iso) {
  if (!iso) return '--';
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPage() {
  const { history, clearHistory } = usePredictionHistory();

  const trendColor = { Bullish: 'trend-bullish', Bearish: 'trend-bearish', Neutral: 'trend-neutral' };

  return (
    <div className="pt-20 pb-16 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label mb-2">Prediction Log</p>
            <h1 className="text-4xl font-black text-white">
              <span className="gradient-text">History</span>
            </h1>
            <p className="text-gray-400 mt-1">{history.length} predictions stored locally</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all prediction history?')) clearHistory();
              }}
              className="btn-ghost text-accent-red border-accent-red/30 hover:border-accent-red/60"
            >
              🗑️ Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4 animate-float">📜</div>
            <h2 className="text-white font-bold text-xl mb-2">No predictions yet</h2>
            <p className="text-gray-500 max-w-sm">
              Go to the <span className="text-btc-orange font-semibold">Predict</span> page
              and run your first IBM AutoAI forecast to see it here.
            </p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: 'Total Predictions',
                  value: history.length,
                  icon: '🔮',
                },
                {
                  label: 'Bullish Signals',
                  value: history.filter((h) => h.trend === 'Bullish').length,
                  icon: '📈',
                  color: 'text-accent-green',
                },
                {
                  label: 'Bearish Signals',
                  value: history.filter((h) => h.trend === 'Bearish').length,
                  icon: '📉',
                  color: 'text-accent-red',
                },
                {
                  label: 'Avg Confidence',
                  value: history.length
                    ? `${(history.reduce((acc, h) => acc + (h.confidence || 0), 0) / history.length).toFixed(1)}%`
                    : '--',
                  icon: '🎯',
                  color: 'text-btc-orange',
                },
              ].map((s) => (
                <div key={s.label} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-xs">{s.label}</p>
                    <span>{s.icon}</span>
                  </div>
                  <p className={`text-2xl font-bold ${s.color || 'text-white'}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Time', 'Open', 'High', 'Low', 'Adj Close', 'Volume', 'Prediction', 'Trend', 'Confidence'].map(
                        (col) => (
                          <th key={col} className="text-left text-gray-500 text-xs font-semibold px-4 py-3 whitespace-nowrap">
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, i) => (
                      <tr
                        key={entry.id || i}
                        className="border-b border-white/5 hover:bg-white/2 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(entry.timestamp)}</td>
                        <td className="px-4 py-3 text-gray-300 font-mono text-xs">{formatPrice(parseFloat(entry.open))}</td>
                        <td className="px-4 py-3 text-accent-green font-mono text-xs">{formatPrice(parseFloat(entry.high))}</td>
                        <td className="px-4 py-3 text-accent-red font-mono text-xs">{formatPrice(parseFloat(entry.low))}</td>
                        <td className="px-4 py-3 text-gray-300 font-mono text-xs">{formatPrice(parseFloat(entry.adj_close))}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs font-mono">{entry.volume ? (parseFloat(entry.volume) / 1e9).toFixed(2) + 'B' : '--'}</td>
                        <td className="px-4 py-3 text-btc-orange font-mono font-semibold text-xs">{formatPrice(entry.prediction)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${trendColor[entry.trend] || 'trend-neutral'}`}>
                            {entry.trend === 'Bullish' ? '📈' : entry.trend === 'Bearish' ? '📉' : '➡️'} {entry.trend}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="confidence-bar w-16">
                              <div className="confidence-fill" style={{ width: `${entry.confidence || 0}%` }} />
                            </div>
                            <span className="text-gray-400 text-xs">{entry.confidence}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
