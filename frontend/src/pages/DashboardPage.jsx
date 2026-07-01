import LivePriceCard from '../components/LivePriceCard';
import SparklineChart from '../components/SparklineChart';
import NewsFeed from '../components/NewsFeed';
import { useMarketData, useNews } from '../hooks/useData';

function StatRow({ label, value, color = 'text-white' }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className={`font-mono font-semibold text-sm ${color}`}>{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { data: market, loading: mLoading, refetch } = useMarketData(30000);
  const { articles, loading: nLoading } = useNews(10);

  const fmt = (p) =>
    p != null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p)
      : '--';
  const pct = (v) =>
    v != null ? (
      <span className={v >= 0 ? 'text-accent-green' : 'text-accent-red'}>
        {v >= 0 ? '+' : ''}{v.toFixed(2)}%
      </span>
    ) : '--';

  return (
    <div className="pt-20 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label mb-1">Market Overview</p>
            <h1 className="text-4xl font-black text-white">
              <span className="gradient-text">Dashboard</span>
            </h1>
          </div>
          <button onClick={refetch} className="btn-ghost">
            🔄 Refresh
          </button>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1">
            <LivePriceCard data={market} loading={mLoading} />
          </div>

          {/* Chart — spans 3 cols */}
          <div className="lg:col-span-3 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-label mb-1">7-Day Price History</p>
                <p className="text-white font-bold text-xl">BTC / USD</p>
                <p className="text-gray-500 text-sm">Sparkline from CoinGecko</p>
              </div>
              {market && (
                <div className={`text-right`}>
                  <p className="text-3xl font-bold font-mono gradient-text">
                    {fmt(market.current_price)}
                  </p>
                  <p className={`text-sm font-semibold ${market.price_change_percentage_24h >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {market.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(market.price_change_percentage_24h || 0).toFixed(2)}% (24h)
                  </p>
                </div>
              )}
            </div>
            {mLoading ? (
              <div className="skeleton h-48 rounded-xl" />
            ) : (
              <SparklineChart sparklineData={market?.sparkline || []} />
            )}
          </div>
        </div>

        {/* TradingView widget */}
        <div className="glass-card p-6 mb-6">
          <p className="section-label mb-4">Advanced Chart — TradingView</p>
          <div
            style={{ height: 400 }}
            className="rounded-xl overflow-hidden"
          >
            <iframe
              title="TradingView BTC Chart"
              src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_btc&symbol=BINANCE%3ABTCUSDT&interval=D&hidesidetoolbar=1&hidetoptoolbar=0&theme=dark&style=1&locale=en&toolbar_bg=%230c1528&enable_publishing=0&withdateranges=1&hide_side_toolbar=0&allow_symbol_change=0&save_image=0&details=0&hotlist=0&calendar=0&show_popup_button=0&popup_width=600&popup_height=400"
              width="100%"
              height="400"
              className="border-0 rounded-xl"
            />
          </div>
        </div>

        {/* Stats + News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detailed stats */}
          <div className="glass-card p-6">
            <p className="section-label mb-4">Market Statistics</p>
            {mLoading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-8 rounded" />)}
              </div>
            ) : market ? (
              <div>
                <StatRow label="Current Price" value={fmt(market.current_price)} color="text-btc-orange" />
                <StatRow label="24h High" value={fmt(market.high_24h)} color="text-accent-green" />
                <StatRow label="24h Low" value={fmt(market.low_24h)} color="text-accent-red" />
                <StatRow label="24h Change" value={<>{pct(market.price_change_percentage_24h)}</>} />
                <StatRow label="7d Change" value={<>{pct(market.price_change_percentage_7d)}</>} />
                <StatRow label="Volume (24h)" value={`$${(market.total_volume / 1e9).toFixed(2)}B`} />
                <StatRow label="Market Cap" value={`$${(market.market_cap / 1e12).toFixed(3)}T`} />
                <StatRow label="All-Time High" value={fmt(market.ath)} color="text-btc-orange" />
                <StatRow label="ATH Change" value={<>{pct(market.ath_change_percentage)}</>} />
                <StatRow
                  label="Circulating Supply"
                  value={`${(market.circulating_supply / 1e6).toFixed(3)}M BTC`}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Unable to fetch market data</p>
            )}
          </div>

          {/* News */}
          <div className="glass-card p-6">
            <p className="section-label mb-4">Latest News</p>
            <NewsFeed articles={articles} loading={nLoading} />
          </div>
        </div>

      </div>
    </div>
  );
}
