import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from './PageLayout';

const MarketNewsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allNews, setAllNews] = useState(location.state?.allNews || []);
  const [loading, setLoading] = useState(!location.state?.allNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Extended mock news data for demonstration
  const extendedMockNews = [
    {
      id: 1,
      title: "NIFTY 50 Hits New All-Time High as Banking Stocks Rally",
      description: "Indian benchmark indices reached record levels driven by strong performance in banking and financial services sector.",
      source: "Economic Times",
      publishedAt: new Date(Date.now() - 1000 * 60 * 30),
      category: "market",
      impact: "positive",
      stocks: ["HDFCBANK", "ICICIBANK", "SBIN"]
    },
    {
      id: 2,
      title: "RBI Maintains Repo Rate at 6.5% in Latest Policy Review",
      description: "Reserve Bank of India keeps key interest rates unchanged, citing inflation concerns and growth stability.",
      source: "Business Standard",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      category: "policy",
      impact: "neutral",
      stocks: ["BANKBARODA", "PNB", "CANFINHOME"]
    },
    {
      id: 3,
      title: "IT Sector Shows Strong Q3 Results with Double-Digit Growth",
      description: "Major IT companies report robust quarterly earnings with increased demand from global clients.",
      source: "Mint",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      category: "earnings",
      impact: "positive",
      stocks: ["TCS", "INFY", "WIPRO", "HCLTECH"]
    },
    {
      id: 4,
      title: "Auto Sector Faces Headwinds Due to Rising Raw Material Costs",
      description: "Automobile manufacturers struggle with increased steel and aluminum prices affecting margins.",
      source: "Economic Times",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      category: "sector",
      impact: "negative",
      stocks: ["MARUTI", "TATAMOTORS", "M&M", "BAJAJ-AUTO"]
    },
    {
      id: 5,
      title: "Foreign Institutional Investors Turn Net Buyers After 3 Months",
      description: "FIIs invest ₹12,000 crores in Indian equities, showing renewed confidence in market prospects.",
      source: "Business Line",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      category: "market",
      impact: "positive",
      stocks: ["RELIANCE", "TCS", "HDFCBANK"]
    },
    // Add more historical news
    {
      id: 6,
      title: "Adani Group Stocks Recover 15% After Regulatory Clarity",
      description: "Adani portfolio companies see significant recovery following SEBI's detailed investigation report.",
      source: "Financial Express",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      category: "market",
      impact: "positive",
      stocks: ["ADANIPORTS", "ADANIGREEN", "ADANITRANS"]
    },
    {
      id: 7,
      title: "Pharmaceutical Exports Show Strong Growth in Q3",
      description: "Indian pharma companies report robust export performance to key international markets.",
      source: "Economic Times",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      category: "sector",
      impact: "positive",
      stocks: ["SUNPHARMA", "DRREDDY", "CIPLA"]
    },
    {
      id: 8,
      title: "SEBI Introduces New Regulations for Mutual Fund Transparency",
      description: "Market regulator announces enhanced disclosure norms for mutual fund schemes and portfolio management.",
      source: "Mint",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      category: "policy",
      impact: "neutral",
      stocks: ["HDFCAMC", "RELCAPITAL", "NIPPONLIFE"]
    }
  ];

  useEffect(() => {
    if (!location.state?.allNews) {
      // Fetch all news if not provided
      const fetchAllNews = async () => {
        try {
          const response = await fetch('/api/market-news/all');
          if (response.ok) {
            const newsData = await response.json();
            setAllNews(newsData);
          } else {
            setAllNews(extendedMockNews);
          }
        } catch (error) {
          console.error('Error fetching all news:', error);
          setAllNews(extendedMockNews);
        }
        setLoading(false);
      };
      
      fetchAllNews();
    }
  }, [location.state]);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'negative': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'market': return '📈';
      case 'policy': return '🏛️';
      case 'earnings': return '💰';
      case 'sector': return '🏭';
      default: return '📰';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  // Filter news based on search and category
  const filteredNews = allNews.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'market', 'policy', 'earnings', 'sector'];

  if (loading) {
    return (
      <PageLayout title="📰 Market News" subtitle="Latest market news and updates">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading all news...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="📰 Market News" subtitle="Latest market news and updates">
      <div className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="glass dark-card p-6 border border-slate-700/30 rounded-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full dark-input rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === category
                      ? 'bg-blue-500 text-white'
                      : 'glass dark-card border border-slate-700/30 text-slate-300 hover:border-slate-600/50'
                  }`}
                >
                  {category === 'All' ? 'All' : `${getCategoryIcon(category)} ${category}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="glass dark-card border border-slate-700/30 rounded-xl p-6 hover:shadow-dark-lg transition-all duration-200 cursor-pointer hover:border-slate-600/50 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(item.impact)}`}>
                    {item.impact}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{formatTimeAgo(item.publishedAt)}</span>
              </div>

              <h3 className="font-semibold text-slate-100 mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-slate-400 mb-3 line-clamp-3">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{item.source}</span>
                {item.stocks && item.stocks.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.stocks.slice(0, 2).map(stock => (
                      <span key={stock} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                        {stock}
                      </span>
                    ))}
                    {item.stocks.length > 2 && (
                      <span className="text-xs text-slate-500">+{item.stocks.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No news found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MarketNewsPage;
