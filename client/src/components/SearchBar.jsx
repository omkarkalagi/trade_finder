import React, { useState, useEffect, useRef } from 'react';
import alpacaService from '../services/alpacaService';
import notificationService from '../services/notificationService';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Mock search data
  const searchData = [
    // Stocks
    { type: 'stock', symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2485.30, change: 1.4 },
    { type: 'stock', symbol: 'TCS', name: 'Tata Consultancy Services', price: 3698.45, change: 1.3 },
    { type: 'stock', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1665.80, change: 1.2 },
    { type: 'stock', symbol: 'INFY', name: 'Infosys Ltd', price: 1478.90, change: 1.1 },
    { type: 'stock', symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 945.30, change: 0.8 },
    { type: 'stock', symbol: 'SBIN', name: 'State Bank of India', price: 542.75, change: -0.5 },
    { type: 'stock', symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 876.45, change: 2.1 },
    { type: 'stock', symbol: 'ITC', name: 'ITC Ltd', price: 456.30, change: 1.2 },
    { type: 'stock', symbol: 'WIPRO', name: 'Wipro Ltd', price: 445.50, change: 0.7 },
    { type: 'stock', symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', price: 10456.75, change: 0.8 },

    // Sectors
    { type: 'sector', name: 'Banking & Financial', stocks: 45, performance: 2.45 },
    { type: 'sector', name: 'Information Technology', stocks: 32, performance: 1.85 },
    { type: 'sector', name: 'Oil & Gas', stocks: 18, performance: -0.75 },
    { type: 'sector', name: 'Pharmaceuticals', stocks: 28, performance: 3.20 },
    { type: 'sector', name: 'Automobiles', stocks: 22, performance: 1.15 },
    { type: 'sector', name: 'FMCG', stocks: 25, performance: 0.95 },

    // Indices
    { type: 'index', name: 'NIFTY 50', value: 19845.65, change: 167.85 },
    { type: 'index', name: 'SENSEX', value: 66589.93, change: 742.19 },
    { type: 'index', name: 'BANK NIFTY', value: 45234.80, change: -103.45 },
    { type: 'index', name: 'NIFTY IT', value: 28456.78, change: 234.56 },

    // Features
    { type: 'feature', name: 'Portfolio Analytics', description: 'Track your portfolio performance', icon: '📊' },
    { type: 'feature', name: 'Sector Scope', description: 'Analyze sector performance', icon: '🎯' },
    { type: 'feature', name: 'Trade Discovery', description: 'Find trading opportunities', icon: '🔍' },
    { type: 'feature', name: 'Strategy Builder', description: 'Build trading strategies', icon: '⚙️' },
    { type: 'feature', name: 'Algo Trading', description: 'Automated trading strategies', icon: '🤖' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);

    try {
      // Try to get real-time search results from API
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const apiResults = await response.json();
        setResults(apiResults.slice(0, 8));
        setIsOpen(true);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Search API error:', error);
    }

    // Fallback to local search with enhanced matching
    setTimeout(() => {
      const filteredResults = searchData.filter(item => {
        const searchTerm = searchQuery.toLowerCase();
        if (item.type === 'stock') {
          return item.symbol.toLowerCase().includes(searchTerm) ||
                 item.name.toLowerCase().includes(searchTerm) ||
                 item.symbol.toLowerCase().startsWith(searchTerm);
        } else if (item.type === 'sector' || item.type === 'index' || item.type === 'feature') {
          return item.name.toLowerCase().includes(searchTerm) ||
                 item.name.toLowerCase().startsWith(searchTerm);
        }
        return false;
      })
      .sort((a, b) => {
        // Prioritize exact matches and starts-with matches
        const aExact = a.symbol?.toLowerCase() === searchQuery.toLowerCase() ||
                      a.name?.toLowerCase() === searchQuery.toLowerCase();
        const bExact = b.symbol?.toLowerCase() === searchQuery.toLowerCase() ||
                      b.name?.toLowerCase() === searchQuery.toLowerCase();

        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        const aStarts = a.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
                       a.name?.toLowerCase().startsWith(searchQuery.toLowerCase());
        const bStarts = b.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
                       b.name?.toLowerCase().startsWith(searchQuery.toLowerCase());

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return 0;
      })
      .slice(0, 8);

      setResults(filteredResults);
      setIsOpen(true);
      setLoading(false);
    }, 200);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleResultClick = async (result) => {
    setQuery(result.symbol || result.name);
    setIsOpen(false);

    if (result.type === 'stock') {
      try {
        // Add to watchlist and show notification
        await alpacaService.addToWatchlist(result.symbol);
        notificationService.notifySystem(`${result.symbol} added to watchlist`, 'success');

        // Also try to get real-time quote
        const quote = await alpacaService.getQuote(result.symbol);
        if (quote) {
          notificationService.notifySystem(
            `${result.symbol}: ₹${quote.price} (${quote.change >= 0 ? '+' : ''}${quote.changePercent}%)`,
            'info'
          );
        }
      } catch (error) {
        console.error('Error adding to watchlist:', error);
        notificationService.notifySystem(`Failed to add ${result.symbol} to watchlist`, 'error');
      }
    } else if (result.type === 'sector') {
      // Navigate to sector analysis
      window.location.href = '/sector-scope';
    } else if (result.type === 'feature') {
      // Navigate to feature based on name
      const featureRoutes = {
        'Portfolio Analytics': '/portfolio-analytics',
        'Sector Scope': '/sector-scope',
        'Trade Discovery': '/trade-discovery',
        'Strategy Builder': '/strategy-builder',
        'Algo Trading': '/algo-trading',
        'Auto Trading': '/auto-trading',
        'Social Trading': '/social-trading',
        'Alternative Data': '/alternative-data',
        'Community & Education': '/community-education'
      };
      const route = featureRoutes[result.name];
      if (route) {
        window.location.href = route;
      }
    }
    setQuery('');
    setIsOpen(false);
  };

  const getResultIcon = (result) => {
    switch (result.type) {
      case 'stock': return '📈';
      case 'sector': return '🏭';
      case 'index': return '📊';
      case 'feature': return result.icon || '⚙️';
      default: return '🔍';
    }
  };

  const getResultSubtext = (result) => {
    switch (result.type) {
      case 'stock':
        return `₹${result.price.toLocaleString()} (${result.change > 0 ? '+' : ''}${result.change}%)`;
      case 'sector':
        return `${result.stocks} stocks • ${result.performance > 0 ? '+' : ''}${result.performance}%`;
      case 'index':
        return `${result.value.toLocaleString()} (${result.change > 0 ? '+' : ''}${result.change.toFixed(2)})`;
      case 'feature':
        return result.description;
      default:
        return '';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search stocks, sectors..."
          className="w-full bg-white border border-gray-300 rounded-full px-3 py-2 pl-10 pr-8 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-500"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 border-b border-gray-200">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>

            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleResultClick(result)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center space-x-3 touch-manipulation"
              >
                <span className="text-xl flex-shrink-0">{getResultIcon(result)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {result.type === 'stock' ? result.symbol : result.name}
                  </div>
                  {result.type === 'stock' && (
                    <div className="text-sm text-gray-600 truncate">{result.name}</div>
                  )}
                  <div className={`text-sm ${
                    result.type === 'stock' && result.change < 0 ? 'text-red-600' :
                    result.type === 'stock' && result.change > 0 ? 'text-green-600' :
                    result.type === 'sector' && result.performance < 0 ? 'text-red-600' :
                    result.type === 'sector' && result.performance > 0 ? 'text-green-600' :
                    'text-gray-500'
                  }`}>
                    {getResultSubtext(result)}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query.trim() && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-6 text-center">
            <span className="text-4xl mb-2 block">🔍</span>
            <p className="text-gray-700">No results found for "{query}"</p>
            <p className="text-sm text-gray-500 mt-1">Try searching for stocks, sectors, or features</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
