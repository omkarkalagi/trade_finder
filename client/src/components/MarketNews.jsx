import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllNews, setShowAllNews] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const navigate = useNavigate();

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

  // Fetch real news from API
  const fetchRealNews = async () => {
    try {
      // Try to fetch from news API using News API
      const newsApiKey = process.env.REACT_APP_NEWS_API_KEY || '0c0cf893b14d468a9f7acf0c588f8345';
      const response = await fetch(`https://newsapi.org/v2/everything?q=indian+stock+market+OR+nifty+OR+sensex+OR+BSE+OR+NSE&language=en&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`);

      if (response.ok) {
        const data = await response.json();
        const processedNews = data.articles.map((article, index) => ({
          id: index + 1,
          title: article.title,
          description: article.description || article.content?.substring(0, 150) + '...',
          source: article.source.name,
          publishedAt: new Date(article.publishedAt),
          category: 'market',
          impact: Math.random() > 0.5 ? 'positive' : Math.random() > 0.3 ? 'negative' : 'neutral',
          stocks: extractStocksFromTitle(article.title),
          url: article.url,
          urlToImage: article.urlToImage
        }));

        setNews(processedNews.slice(0, 8)); // Show latest 8
        setAllNews(processedNews); // Store all news
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching real news:', error);
    }

    // Fallback to mock data with more realistic timestamps
    const updatedMockNews = mockNews.map(item => ({
      ...item,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Random time within last 24 hours
    }));

    setNews(updatedMockNews.slice(0, 8));
    setAllNews(updatedMockNews);
    setLoading(false);
  };

  // Extract stock symbols from news title
  const extractStocksFromTitle = (title) => {
    const stockKeywords = {
      'reliance': ['RELIANCE'],
      'tcs': ['TCS'],
      'infosys': ['INFY'],
      'hdfc': ['HDFCBANK'],
      'icici': ['ICICIBANK'],
      'sbi': ['SBIN'],
      'adani': ['ADANIPORTS', 'ADANIGREEN'],
      'tata': ['TATAMOTORS', 'TATACONSUM'],
      'wipro': ['WIPRO'],
      'bharti': ['BHARTIARTL'],
      'maruti': ['MARUTI'],
      'bajaj': ['BAJFINANCE']
    };

    const stocks = [];
    const lowerTitle = title.toLowerCase();

    Object.entries(stockKeywords).forEach(([keyword, symbols]) => {
      if (lowerTitle.includes(keyword)) {
        stocks.push(...symbols);
      }
    });

    return stocks.slice(0, 3); // Limit to 3 stocks
  };

  useEffect(() => {
    fetchRealNews();

    // Refresh news every 5 minutes
    const interval = setInterval(fetchRealNews, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-700 bg-green-100 border-green-200';
      case 'negative': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-blue-700 bg-blue-100 border-blue-200';
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

  const displayedNews = showAllNews ? allNews : news;

  const handleViewAll = () => {
    navigate('/market-news', { state: { allNews } });
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">📰</span>
          Market News
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleViewAll}
            className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All
          </button>
          <div className="flex items-center space-x-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading latest news...</p>
          </div>
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedNews.map((item) => (
            <div
              key={item.id}
              className="glass border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300 h-full flex flex-col"
              onClick={() => item.url && window.open(item.url, '_blank')}
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

              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-3 hover:text-blue-600 transition-colors text-sm">
                {item.title}
              </h3>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Read →
                  </button>
                </div>
                {item.stocks.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.stocks.slice(0, 2).map((stock, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                        {stock}
                      </span>
                    ))}
                    {item.stocks.length > 2 && (
                      <span className="text-xs text-gray-500">+{item.stocks.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* View All Button */}
          {!showAllNews && allNews.length > 5 && (
            <button
              onClick={() => setShowAllNews(true)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">📰</span>
              View All News ({allNews.length - 5} more)
            </button>
          )}

          {showAllNews && (
            <button
              onClick={() => setShowAllNews(false)}
              className="w-full py-3 glass border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              <span className="mr-2">📰</span>
              Show Less
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">📰</span>
          <p className="text-gray-600">No news available at the moment</p>
          <button
            onClick={fetchRealNews}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Refresh News
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketNews;
