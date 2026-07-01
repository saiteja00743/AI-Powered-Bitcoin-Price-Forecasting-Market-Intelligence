import { useState, useEffect } from 'react';

export default function Navbar({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'predict', label: 'Predict', icon: '🔮' },
    { id: 'chat', label: 'AI Chat', icon: '🤖' },
    { id: 'history', label: 'History', icon: '📜' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/90 backdrop-blur-xl border-b border-white/5 shadow-card' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-btc-orange flex items-center justify-center text-white font-bold text-sm shadow-btc-sm group-hover:shadow-btc transition-all duration-300">
              ₿
            </div>
            <span className="font-bold text-lg">
              <span className="gradient-text">BitSense</span>
              <span className="text-white ml-1 font-light">AI</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activePage === item.id
                    ? 'bg-btc-orange/15 text-btc-orange border border-btc-orange/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Live badge */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-accent-green/10 border border-accent-green/25 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
              <span className="text-accent-green text-xs font-semibold">LIVE</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-900/95 backdrop-blur-xl border-b border-white/5 px-4 pb-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                activePage === item.id
                  ? 'bg-btc-orange/15 text-btc-orange'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
