import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MarketNews = ({ compact = false }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock news data for demonstration
  const mockNews = [
    {
      id: 1,
      title: "Federal Reserve Announces Interest Rate Decision",
      summary: "Fed maintains current rates amid inflation concerns and economic uncertainty",
      source: "Reuters",
      publishedAt: "2024-01-15T10:30:00Z",
      url: "#",
      sentiment: "neutral"
    },
    {
      id: 2,
      title: "Tech Stocks Rally on Strong Earnings",
      summary: "Major tech companies report better-than-expected quarterly results",
      source: "Bloomberg",
      publishedAt: "2024-01-15T09:15:00Z",
      url: "#",
      sentiment: "positive"
    },
    {
      id: 3,
      title: "Oil Prices Surge on Supply Concerns",
      summary: "Crude oil futures jump 3% following geopolitical tensions in key producing regions",
      source: "MarketWatch",
      publishedAt: "2024-01-15T08:45:00Z",
      url: "#",
      sentiment: "neutral"
    },
    {
      id: 4,
      title: "Cryptocurrency Market Shows Mixed Signals",
      summary: "Bitcoin consolidates while altcoins experience volatility",
      source: "CoinDesk",
      publishedAt: "2024-01-15T07:20:00Z",
      url: "#",
      sentiment: "negative"
    },
    {
      id: 5,
      title: "Global Markets React to Economic Data",
      summary: "Asian markets open higher following positive economic indicators",
      source: "Financial Times",
      publishedAt: "2024-01-15T06:00:00Z",
      url: "#",
      sentiment: "positive"
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNews(mockNews);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market news');
        setNews(mockNews); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const newsTime = new Date(timestamp);
    const diffInHours = Math.floor((now - newsTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(compact ? 3 : 5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayNews = compact ? news.slice(0, 3) : news;

  if (compact) {
    return (
      <div className="space-y-3">
        {displayNews.map((article) => (
          <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0">
            <div className="flex items-start space-x-3">
              <span className="text-lg mt-1">{getSentimentIcon(article.sentiment)}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{article.source}</span>
                  <span className="text-xs text-gray-400">{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <Link 
          to="/news" 
          className="block text-center px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          View All News
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Market News</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {displayNews.map((article) => (
          <article key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl`}>
                  {getSentimentIcon(article.sentiment)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">{article.source}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{formatTimeAgo(article.publishedAt)}</span>
                  <span className={`text-sm font-medium ${getSentimentColor(article.sentiment)}`}>
                    {article.sentiment}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <a 
                    href={article.url}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read More
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MarketNews;
