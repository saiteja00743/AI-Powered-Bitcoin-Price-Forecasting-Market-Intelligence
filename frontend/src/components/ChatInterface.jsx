import { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';

const SUGGESTIONS = [
  'Should I buy Bitcoin today?',
  'What is the price forecast for BTC?',
  'Is now a good time to invest?',
  'What does the trend look like?',
  'Explain the prediction to me',
];

function MarkdownText({ text }) {
  // Simple markdown renderer for bold and line breaks
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\n)/g);
  return (
    <div className="prose-btc">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part === '\n') return <br key={i} />;
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

export default function ChatInterface({ currentPrice }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "👋 Hi! I'm **BitSense AI**, your Bitcoin analysis assistant. Ask me anything about BTC — predictions, market trends, investment signals, or trading strategy!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const question = text || input.trim();
    if (!question || loading) return;
    setInput('');

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: question, timestamp: new Date().toISOString() },
    ]);
    setLoading(true);

    try {
      const res = await api.chat({
        question,
        current_price: currentPrice || undefined,
        adj_close: currentPrice || undefined,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: res.answer,
          prediction: res.prediction,
          trend: res.trend,
          confidence: res.confidence,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `⚠️ Error: ${err.message}. Make sure the backend is running.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const trendBadge = (trend) => {
    if (!trend) return null;
    const classes = { Bullish: 'trend-bullish', Bearish: 'trend-bearish', Neutral: 'trend-neutral' };
    return <span className={`${classes[trend] || 'trend-neutral'} text-xs ml-2`}>{trend}</span>;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap mb-4">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => sendMessage(s)}
            className="text-xs bg-dark-700/50 hover:bg-btc-orange/10 border border-white/10 hover:border-btc-orange/30 text-gray-400 hover:text-btc-orange rounded-full px-3 py-1.5 transition-all duration-200"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[400px] min-h-[300px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`animate-fade-in ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
          >
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-btc-orange flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-1">
                ₿
              </div>
            )}
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              <MarkdownText text={msg.content} />
              {msg.trend && (
                <div className="mt-2 flex items-center gap-2">
                  {trendBadge(msg.trend)}
                  {msg.confidence && (
                    <span className="text-xs text-gray-500">{msg.confidence}% confidence</span>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-600 mt-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-btc-orange flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
              ₿
            </div>
            <div className="chat-bubble-ai flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-btc-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-btc-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-btc-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-gray-500 text-sm">Analyzing market data...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          className="input-dark flex-1"
          placeholder="Ask about Bitcoin... e.g. Should I invest today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-btc disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 px-5"
        >
          {loading ? '⏳' : '↑'}
        </button>
      </div>
    </div>
  );
}
