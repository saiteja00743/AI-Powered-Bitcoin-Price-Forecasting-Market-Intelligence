import { useState } from 'react';
import LivePriceCard from '../components/LivePriceCard';
import NewsFeed from '../components/NewsFeed';
import SparklineChart from '../components/SparklineChart';
import PredictionCard from '../components/PredictionCard';
import { useMarketData, useNews } from '../hooks/useData';

function StatCard({ label, value, sub, icon, color = 'text-white' }) {
  return (
    <div className="glass-card-hover p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-xs font-medium">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
      {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function HomePage({ setActivePage }) {
  const { data: market, loading: mLoading } = useMarketData(30000);
  const { articles, loading: nLoading } = useNews(6);

  const formatPrice = (p) =>
    p ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p) : '--';
  const formatLarge = (n) => {
    if (!n) return '--';
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    return `$${n.toLocaleString()}`;
  };

  return (
    <div className="pt-20 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="text-center mb-12 relative">
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-btc-orange/10 border border-btc-orange/25 rounded-full px-4 py-2 mb-6">
              <span className="text-btc-orange text-sm">🚀</span>
              <span className="text-btc-orange text-sm font-semibold">AI-Powered Bitcoin Forecasting</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-4">
              <span className="gradient-text text-glow">BitSense</span>
              <span className="text-white"> AI</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              IBM AutoAI-powered Bitcoin price predictions with real-time market data,
              AI-driven analysis, and intelligent investment signals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button className="btn-btc text-base px-8 py-4" onClick={() => setActivePage('predict')}>
                🔮 Get Prediction
              </button>
              <button className="btn-ghost text-base px-8 py-4" onClick={() => setActivePage('chat')}>
                🤖 Ask AI
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left col — live price */}
          <div className="space-y-6">
            <LivePriceCard data={market} loading={mLoading} />

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="All-Time High"
                value={formatPrice(market?.ath)}
                sub={market?.ath_change_percentage ? `${market.ath_change_percentage.toFixed(1)}% from ATH` : ''}
                icon="🏆"
                color="text-btc-orange"
              />
              <StatCard
                label="Circulating"
                value={market?.circulating_supply ? `${(market.circulating_supply / 1e6).toFixed(2)}M` : '--'}
                sub="BTC in circulation"
                icon="💎"
              />
              <StatCard
                label="1h Change"
                value={market?.price_change_percentage_1h != null ? `${market.price_change_percentage_1h.toFixed(2)}%` : '--'}
                icon="⚡"
                color={market?.price_change_percentage_1h >= 0 ? 'text-accent-green' : 'text-accent-red'}
              />
              <StatCard
                label="7d Change"
                value={market?.price_change_percentage_7d != null ? `${market.price_change_percentage_7d.toFixed(2)}%` : '--'}
                icon="📅"
                color={market?.price_change_percentage_7d >= 0 ? 'text-accent-green' : 'text-accent-red'}
              />
            </div>
          </div>

          {/* Middle col — chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-label mb-1">7-Day Price Chart</p>
                <p className="text-white font-bold text-lg">BTC / USD</p>
              </div>
              <button
                onClick={() => setActivePage('dashboard')}
                className="btn-ghost text-sm"
              >
                Full Dashboard →
              </button>
            </div>
            {mLoading ? (
              <div className="skeleton h-48 rounded-xl" />
            ) : (
              <SparklineChart sparklineData={market?.sparkline || []} />
            )}
          </div>
        </div>

        {/* ── CTA Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: '🔮',
              title: 'Price Prediction',
              desc: 'Get IBM AutoAI-powered close price forecasts using OHLCV market data.',
              action: 'predict',
              cta: 'Predict Now',
              color: 'from-btc-orange/20 to-transparent border-btc-orange/20',
            },
            {
              icon: '🤖',
              title: 'AI Chat',
              desc: 'Ask any question about Bitcoin and get data-driven LLM explanations.',
              action: 'chat',
              cta: 'Ask AI',
              color: 'from-accent-blue/20 to-transparent border-accent-blue/20',
            },
            {
              icon: '📊',
              title: 'Dashboard',
              desc: 'Full market analysis with candlestick charts and prediction history.',
              action: 'dashboard',
              cta: 'Open Dashboard',
              color: 'from-accent-purple/20 to-transparent border-accent-purple/20',
            },
          ].map((card) => (
            <div
              key={card.action}
              className={`glass-card-hover p-6 bg-gradient-to-br ${card.color} cursor-pointer`}
              onClick={() => setActivePage(card.action)}
            >
              <div className="text-4xl mb-3 animate-float">{card.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{card.desc}</p>
              <span className="text-btc-orange text-sm font-semibold">{card.cta} →</span>
            </div>
          ))}
        </div>

        {/* ── News ─────────────────────────────────────────────── */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="section-label">Latest Crypto News</p>
            <span className="text-gray-600 text-xs">{articles.length} articles</span>
          </div>
          <NewsFeed articles={articles} loading={nLoading} compact />
        </div>

      </div>
    </div>
  );
}
