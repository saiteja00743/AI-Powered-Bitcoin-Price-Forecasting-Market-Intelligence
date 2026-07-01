const sentimentConfig = {
  positive: { class: 'sentiment-positive', icon: '🟢', label: 'Positive' },
  negative: { class: 'sentiment-negative', icon: '🔴', label: 'Negative' },
  neutral: { class: 'sentiment-neutral', icon: '⚪', label: 'Neutral' },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NewsFeed({ articles = [], loading, compact = false }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-4xl mb-2">📰</span>
        <p className="text-gray-500">No news available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {articles.map((article, i) => {
        const sConf = sentimentConfig[article.sentiment] || sentimentConfig.neutral;
        return (
          <a
            key={i}
            href={article.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-xl bg-dark-700/40 hover:bg-dark-700/70 border border-white/5 hover:border-white/10 transition-all duration-200 group"
          >
            {/* Sentiment dot */}
            <div className="flex-shrink-0 mt-0.5">
              <span className="text-base">{sConf.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-200 ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}>
                {article.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-500 text-xs">{article.source}</span>
                {article.published_at && (
                  <>
                    <span className="text-gray-700">·</span>
                    <span className="text-gray-600 text-xs">{timeAgo(article.published_at)}</span>
                  </>
                )}
                <span className={`${sConf.class} ml-auto flex-shrink-0`}>{sConf.label}</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
