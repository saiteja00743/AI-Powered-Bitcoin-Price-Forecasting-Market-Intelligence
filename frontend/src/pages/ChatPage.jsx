import ChatInterface from '../components/ChatInterface';
import { useMarketData } from '../hooks/useData';

export default function ChatPage() {
  const { data: market } = useMarketData(60000);

  return (
    <div className="pt-20 pb-16 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-btc-orange to-btc-orange-dark flex items-center justify-center text-3xl mx-auto mb-4 shadow-btc animate-float">
            🤖
          </div>
          <p className="section-label mb-2">AI Assistant</p>
          <h1 className="text-4xl font-black text-white mb-2">
            Ask <span className="gradient-text">BitSense AI</span>
          </h1>
          <p className="text-gray-400">
            Powered by IBM AutoAI predictions + LLM analysis. Ask anything about Bitcoin.
          </p>
        </div>

        {/* Context bar */}
        {market && (
          <div className="glass-card p-4 mb-6 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
              <span className="text-gray-400 text-sm">Live context active</span>
            </div>
            <div className="flex items-center gap-4 ml-auto flex-wrap">
              <div>
                <p className="text-gray-600 text-xs">Current Price</p>
                <p className="text-white font-mono font-semibold text-sm">
                  ${market.current_price?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">24h Change</p>
                <p className={`font-semibold text-sm ${market.price_change_percentage_24h >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {market.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">24h Volume</p>
                <p className="text-white font-mono text-sm">
                  ${(market.total_volume / 1e9).toFixed(1)}B
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat */}
        <div className="glass-card p-6">
          <ChatInterface currentPrice={market?.current_price} />
        </div>

        {/* Disclaimer */}
        <p className="text-gray-700 text-xs text-center mt-4">
          ⚠️ BitSense AI provides analysis for educational purposes only. Not financial advice.
          Always DYOR before making investment decisions.
        </p>
      </div>
    </div>
  );
}
