import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PredictPage from './pages/PredictPage';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';

const PAGES = {
  home: HomePage,
  dashboard: DashboardPage,
  predict: PredictPage,
  chat: ChatPage,
  history: HistoryPage,
};

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const PageComponent = PAGES[activePage] || HomePage;

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main>
        <PageComponent setActivePage={setActivePage} />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-btc-orange flex items-center justify-center text-white font-bold text-xs">
              ₿
            </div>
            <span className="text-gray-500 text-sm">
              <span className="gradient-text font-semibold">BitSense AI</span> — AI-Powered Bitcoin Forecasting
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 text-xs">
            <span>Powered by IBM AutoAI</span>
            <span>·</span>
            <span>CoinGecko API</span>
            <span>·</span>
            <span>FastAPI + React</span>
          </div>
          <p className="text-gray-700 text-xs">
            ⚠️ Not financial advice. For educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
