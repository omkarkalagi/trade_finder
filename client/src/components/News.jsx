import React, { useState, useEffect } from 'react';
import newsService from '../services/newsService';
import LoadingSpinner from './common/LoadingSpinner';
import Header from './Header';
import Sidebar from './Sidebar';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const latestNews = await newsService.fetchLatestNews();
        setNews(latestNews);
        setCategories(newsService.getCategories());
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setNews(newsService.getLatestNews(20));
        setCategories(newsService.getCategories());
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on category, sentiment, and search query
  useEffect(() => {
    let filtered = [...news];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by sentiment
    if (selectedSentiment !== 'all') {
      filtered = filtered.filter(item => item.sentiment === selectedSentiment);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredNews(filtered);
  }, [news, selectedCategory, selectedSentiment, searchQuery]);

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      default:
        return '📊';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Market':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'Policy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Earnings':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">📰 Market News</h1>
              <p className="text-slate-400">Stay updated with the latest market developments and financial news</p>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full p-2 pl-10 text-sm text-white bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search news..."
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-2 text-sm text-white bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>

                {/* Sentiment Filter */}
                <select
                  value={selectedSentiment}
                  onChange={(e) => setSelectedSentiment(e.target.value)}
                  className="p-2 text-sm text-white bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Sentiment</option>
                  <option value="positive">📈 Positive</option>
                  <option value="neutral">📊 Neutral</option>
                  <option value="negative">📉 Negative</option>
                </select>

                {/* Refresh Button */}
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {/* News Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading news..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNews.map((newsItem) => (
                  <div key={newsItem.id} className="bg-slate-800 rounded-xl overflow-hidden hover:bg-slate-750 transition-colors cursor-pointer group">
                    {/* News Image */}
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop';
                        }}
                      />
                      <div className="absolute top-4 left-4 flex space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(newsItem.sentiment)}`}>
                          {getSentimentIcon(newsItem.sentiment)} {newsItem.sentiment}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-900 text-white">
                          {newsItem.category}
                        </span>
                      </div>
                    </div>

                    {/* News Content */}
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="text-blue-400 mr-2">
                          {getCategoryIcon(newsItem.category)}
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(newsItem.timestamp).toLocaleDateString()} • {newsItem.source}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {newsItem.title}
                      </h3>

                      <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                        {newsItem.summary}
                      </p>

                      {/* Tags */}
                      {newsItem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {newsItem.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {new Date(newsItem.timestamp).toLocaleTimeString()}
                        </span>
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                          Read More
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* No Results */}
                {filteredNews.length === 0 && !loading && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <h3 className="text-xl font-medium mb-2">No news found</h3>
                      <p className="text-slate-500">Try adjusting your filters or search terms</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Load More Button */}
            {filteredNews.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                  Load More News
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
