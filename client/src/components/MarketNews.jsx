import React, { useState, useEffect } from 'react';

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllNews, setShowAllNews] = useState(false);

  // Mock news data with Indian market focus
  const mockNews = [
    {
      id: 1,
      title: "NIFTY 50 Hits New All-Time High as Banking Stocks Rally",
      description: "Indian benchmark indices reached record levels driven by strong performance in banking and financial services sector.",
      source: "Economic Times",
      publishedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      category: "market",
      impact: "positive",
      stocks: ["HDFCBANK", "ICICIBANK", "SBIN"]
    },
    {
      id: 2,
      title: "RBI Monetary Policy: Key Rate Unchanged at 6.5%",
      description: "Reserve Bank of India maintains repo rate, focuses on inflation control and economic growth balance.",
      source: "Business Standard",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      category: "policy",
      impact: "neutral",
      stocks: ["BANKBARODA", "PNB"]
    },
    {
      id: 3,
      title: "Reliance Industries Q3 Results Beat Estimates",
      description: "RIL reports strong quarterly earnings driven by petrochemicals and retail business growth.",
      source: "Mint",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      category: "earnings",
      impact: "positive",
      stocks: ["RELIANCE"]
    },
    {
      id: 4,
      title: "IT Sector Faces Headwinds Amid Global Slowdown Concerns",
      description: "Technology stocks under pressure as clients reduce spending on discretionary projects.",
      source: "Moneycontrol",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      category: "sector",
      impact: "negative",
      stocks: ["TCS", "INFY", "WIPRO"]
    },
    {
      id: 5,
      title: "Foreign Institutional Investors Turn Net Buyers",
      description: "FIIs invest ₹2,500 crore in Indian equities amid positive market sentiment.",
      source: "Financial Express",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      category: "flows",
      impact: "positive",
      stocks: []
    },
    // Older news for "View All" functionality
    {
      id: 6,
      title: "Adani Group Stocks Recover After Recent Volatility",
      description: "Adani portfolio companies show signs of stabilization following recent market turbulence.",
      source: "Reuters",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      category: "market",
      impact: "positive",
      stocks: ["ADANIPORTS", "ADANIGREEN"]
    },
    {
      id: 7,
      title: "Auto Sector Outlook Positive on Rural Demand Recovery",
      description: "Automobile manufacturers expect strong growth driven by improving rural consumption patterns.",
      source: "Hindu BusinessLine",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      category: "sector",
      impact: "positive",
      stocks: ["MARUTI", "TATAMOTORS", "M&M"]
    },
    {
      id: 8,
      title: "Pharmaceutical Exports Show Strong Growth in Q3",
      description: "Indian pharma companies report robust export performance to key international markets.",
      source: "Economic Times",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      category: "sector",
      impact: "positive",
      stocks: ["SUNPHARMA", "DRREDDY", "CIPLA"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return 'ℹ️';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'market': return '📊';
      case 'policy': return '🏛️';
      case 'earnings': return '💰';
      case 'sector': return '🏭';
      case 'flows': return '💸';
      default: return '📰';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const displayedNews = showAllNews ? news : news.slice(0, 5);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">📰</span>
          Market News
        </h2>
        <div className="flex items-center space-x-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading latest news...</p>
          </div>
        </div>
      ) : news.length > 0 ? (
        <div className="space-y-3">
          {displayedNews.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(item.impact)}`}>
                    {getImpactIcon(item.impact)} {item.impact}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatTimeAgo(item.publishedAt)}</span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  {item.stocks.length > 0 && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <div className="flex space-x-1">
                        {item.stocks.slice(0, 2).map((stock, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {stock}
                          </span>
                        ))}
                        {item.stocks.length > 2 && (
                          <span className="text-xs text-gray-500">+{item.stocks.length - 2}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}

          {/* View All Button */}
          {!showAllNews && news.length > 5 && (
            <button
              onClick={() => setShowAllNews(true)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">📰</span>
              View All News ({news.length - 5} more)
            </button>
          )}

          {showAllNews && (
            <button
              onClick={() => setShowAllNews(false)}
              className="w-full py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
            >
              <span className="mr-2">📰</span>
              Show Less
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">📰</span>
          <p className="text-gray-500">No news available at the moment</p>
        </div>
      )}
    </div>
  );
};

export default MarketNews;
