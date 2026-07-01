import { useEffect, useState } from 'react';

function formatPrice(price) {
  if (!price) return '--';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

function formatLargeNum(num) {
  if (!num) return '--';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

export default function LivePriceCard({ data, loading }) {
  const [prevPrice, setPrevPrice] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (data?.current_price && prevPrice && data.current_price !== prevPrice) {
      setFlash(data.current_price > prevPrice ? 'up' : 'down');
      const t = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(t);
    }
    if (data?.current_price) setPrevPrice(data.current_price);
  }, [data?.current_price]);

  const isUp = data?.price_change_percentage_24h >= 0;

  if (loading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="skeleton h-4 w-24 mb-4 rounded" />
        <div className="skeleton h-12 w-48 mb-3 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 relative overflow-hidden animate-fade-in">
      {/* BG glow */}
      <div className="absolute inset-0 bg-btc-glow opacity-50 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={data?.image || 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'}
              alt="Bitcoin"
              className="w-8 h-8 rounded-full"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <p className="text-white font-semibold text-sm">Bitcoin</p>
              <p className="text-gray-500 text-xs font-mono">BTC / USD</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-accent-green/10 border border-accent-green/20 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
            <span className="text-accent-green text-xs font-semibold">LIVE</span>
          </div>
        </div>

        {/* Price */}
        <div
          className={`transition-colors duration-300 ${
            flash === 'up' ? 'text-accent-green' : flash === 'down' ? 'text-accent-red' : ''
          }`}
        >
          <p className="text-4xl font-bold text-glow gradient-text font-mono">
            {formatPrice(data?.current_price)}
          </p>
        </div>

        {/* 24h change */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-lg font-semibold ${isUp ? 'price-up' : 'price-down'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(data?.price_change_percentage_24h || 0).toFixed(2)}%
          </span>
          <span className="text-gray-500 text-sm">24h</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5">
          <div>
            <p className="text-gray-500 text-xs mb-1">24h High</p>
            <p className="text-white font-semibold text-sm">{formatPrice(data?.high_24h)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">24h Low</p>
            <p className="text-white font-semibold text-sm">{formatPrice(data?.low_24h)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Volume</p>
            <p className="text-white font-semibold text-sm">{formatLargeNum(data?.total_volume)}</p>
          </div>
        </div>

        {/* Market cap */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-gray-500 text-xs">Market Cap</p>
          <p className="text-gray-300 text-sm font-semibold">{formatLargeNum(data?.market_cap)}</p>
        </div>
      </div>
    </div>
  );
}
