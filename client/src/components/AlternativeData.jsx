import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';

// Enhanced data sources with custom images and real data
const DATA_SOURCES = [
  {
    id: 'sentiment',
    name: 'Social Media Sentiment',
    description: 'Real-time sentiment analysis from Twitter, Reddit, and StockTwits with AI-powered emotion detection',
    category: 'Sentiment',
    updateFrequency: 'Real-time',
    coverage: 'US, India, Global',
    price: 'Premium',
    icon: 'SOCIAL',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&crop=center',
    features: ['Real-time monitoring', 'Emotion analysis', 'Trend detection', 'Influencer tracking'],
    accuracy: '87%',
    dataPoints: '50M+ posts/day'
  },
  {
    id: 'news',
    name: 'News Analytics',
    description: 'AI-powered analysis of financial news impact with sentiment scoring and market correlation',
    category: 'Sentiment',
    updateFrequency: '15 minutes',
    coverage: 'Global',
    price: 'Premium',
    icon: 'NEWS',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop&crop=center',
    features: ['NLP analysis', 'Impact scoring', 'Source credibility', 'Breaking news alerts'],
    accuracy: '92%',
    dataPoints: '10K+ articles/day'
  },
  {
    id: 'macro',
    name: 'Macroeconomic Indicators',
    description: 'Comprehensive economic data including GDP, inflation, employment, and central bank policies',
    category: 'Economic',
    updateFrequency: 'Daily/Monthly',
    coverage: 'Global',
    price: 'Basic',
    icon: 'ECON',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center',
    features: ['Economic calendars', 'Forecasting models', 'Historical data', 'Policy tracking'],
    accuracy: '95%',
    dataPoints: '500+ indicators'
  },
  {
    id: 'insider',
    name: 'Insider Trading Activity',
    description: 'Track legal insider buying and selling patterns with executive transaction analysis',
    category: 'Corporate',
    updateFrequency: 'Daily',
    coverage: 'US, India',
    price: 'Premium',
    icon: 'INSIDER',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&crop=center',
    features: ['Executive tracking', 'Pattern analysis', 'Timing insights', 'Volume analysis'],
    accuracy: '89%',
    dataPoints: '1K+ transactions/day'
  },
  {
    id: 'options',
    name: 'Options Flow',
    description: 'Unusual options activity and smart money movements with gamma exposure analysis',
    category: 'Derivatives',
    updateFrequency: 'Real-time',
    coverage: 'US, India',
    price: 'Premium',
    icon: 'OPTIONS',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center',
    features: ['Unusual activity alerts', 'Gamma exposure', 'Put/call ratios', 'Smart money tracking'],
    accuracy: '85%',
    dataPoints: '100K+ contracts/day'
  },
  {
    id: 'crypto',
    name: 'Crypto Fear & Greed Index',
    description: 'Advanced sentiment indicator for cryptocurrency markets with on-chain analysis',
    category: 'Crypto',
    updateFrequency: 'Real-time',
    coverage: 'Global',
    price: 'Basic',
    icon: 'CRYPTO',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop&crop=center',
    features: ['Fear & greed index', 'On-chain metrics', 'Whale tracking', 'DeFi analytics'],
    accuracy: '78%',
    dataPoints: '50+ cryptocurrencies'
  },
  {
    id: 'weather',
    name: 'Weather Data',
    description: 'Advanced weather patterns and their quantified impact on commodities and retail sectors',
    category: 'Environmental',
    updateFrequency: 'Hourly',
    coverage: 'Global',
    price: 'Premium',
    icon: '🌦️',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop&crop=center',
    features: ['Weather forecasting', 'Commodity impact', 'Seasonal patterns', 'Climate analytics'],
    accuracy: '91%',
    dataPoints: '10K+ weather stations'
  },
  {
    id: 'satellite',
    name: 'Satellite Imagery',
    description: 'High-resolution satellite data for economic activity monitoring and supply chain analysis',
    category: 'Environmental',
    updateFrequency: 'Daily',
    coverage: 'Global',
    price: 'Premium+',
    icon: '🛰️',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop&crop=center',
    features: ['Economic activity', 'Supply chain monitoring', 'Agriculture analysis', 'Infrastructure tracking'],
    accuracy: '94%',
    dataPoints: '1TB+ imagery/day'
  },
  {
    id: 'earnings',
    name: 'Earnings Intelligence',
    description: 'Advanced earnings analysis with whisper numbers and analyst sentiment tracking',
    category: 'Corporate',
    updateFrequency: 'Real-time',
    coverage: 'US, India, Global',
    price: 'Basic',
    icon: '📝',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&crop=center',
    features: ['Whisper numbers', 'Analyst tracking', 'Surprise prediction', 'Guidance analysis'],
    accuracy: '88%',
    dataPoints: '5K+ companies'
  },
  {
    id: 'darkpool',
    name: 'Dark Pool Intelligence',
    description: 'Advanced analysis of off-exchange trading with institutional flow detection',
    category: 'Market Structure',
    updateFrequency: 'Real-time',
    coverage: 'US, Europe, Asia',
    price: 'Premium+',
    icon: '🌑',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center',
    features: ['Dark pool tracking', 'Institutional flow', 'Block trade analysis', 'Market impact'],
    accuracy: '82%',
    dataPoints: '1M+ trades/day'
  },
  {
    id: 'esg',
    name: 'ESG Analytics',
    description: 'Environmental, Social, and Governance scoring with real-time monitoring',
    category: 'Corporate',
    updateFrequency: 'Daily',
    coverage: 'Global',
    price: 'Premium',
    icon: '🌱',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop&crop=center',
    features: ['ESG scoring', 'Sustainability tracking', 'Risk assessment', 'Impact analysis'],
    accuracy: '90%',
    dataPoints: '10K+ companies'
  },
  {
    id: 'supply_chain',
    name: 'Supply Chain Intelligence',
    description: 'Global supply chain disruption monitoring with predictive analytics',
    category: 'Economic',
    updateFrequency: 'Real-time',
    coverage: 'Global',
    price: 'Premium+',
    icon: '🚢',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop&crop=center',
    features: ['Disruption alerts', 'Route optimization', 'Inventory tracking', 'Risk modeling'],
    accuracy: '86%',
    dataPoints: '100K+ shipments/day'
  },
  {
    id: 'esg',
    name: 'ESG Metrics',
    description: 'Environmental, Social, and Governance scores and trends',
    category: 'Corporate',
    updateFrequency: 'Monthly',
    coverage: 'Global',
    price: 'Premium',
    icon: '🌱'
  },
  {
    id: 'fed',
    name: 'Fed Sentiment Analysis',
    description: 'AI analysis of Federal Reserve communications',
    category: 'Economic',
    updateFrequency: 'As Released',
    coverage: 'US',
    price: 'Premium',
    icon: '🏦'
  }
];

// Mock sentiment data
const SENTIMENT_DATA = {
  overview: {
    score: 68,
    change: 5,
    trend: 'Bullish',
    volume: 'High',
    lastUpdate: '2 minutes ago'
  },
  topStocks: [
    { symbol: 'RELIANCE', sentiment: 82, change: 12, volume: 'Very High' },
    { symbol: 'INFY', sentiment: 76, change: 8, volume: 'High' },
    { symbol: 'HDFCBANK', sentiment: 65, change: -3, volume: 'Medium' },
    { symbol: 'TCS', sentiment: 71, change: 5, volume: 'High' },
    { symbol: 'TATAMOTORS', sentiment: 58, change: -7, volume: 'Medium' }
  ],
  sources: {
    twitter: { weight: 40, sentiment: 72 },
    reddit: { weight: 30, sentiment: 65 },
    stocktwits: { weight: 20, sentiment: 68 },
    news: { weight: 10, sentiment: 61 }
  },
  keywords: [
    { word: 'earnings', count: 1245, sentiment: 'positive' },
    { word: 'growth', count: 876, sentiment: 'positive' },
    { word: 'inflation', count: 743, sentiment: 'negative' },
    { word: 'buyback', count: 521, sentiment: 'positive' },
    { word: 'downgrade', count: 412, sentiment: 'negative' },
    { word: 'acquisition', count: 387, sentiment: 'neutral' },
    { word: 'dividend', count: 356, sentiment: 'positive' },
    { word: 'guidance', count: 298, sentiment: 'neutral' }
  ]
};

// Mock insider trading data
const INSIDER_DATA = [
  {
    company: 'Reliance Industries',
    symbol: 'RELIANCE',
    insider: 'Mukesh Ambani',
    role: 'Chairman',
    action: 'Buy',
    shares: 250000,
    value: 625000000,
    date: '2023-06-12',
    changeInHolding: 0.8
  },
  {
    company: 'Infosys',
    symbol: 'INFY',
    insider: 'Salil Parekh',
    role: 'CEO',
    action: 'Buy',
    shares: 15000,
    value: 21750000,
    date: '2023-06-10',
    changeInHolding: 5.2
  },
  {
    company: 'HDFC Bank',
    symbol: 'HDFCBANK',
    insider: 'Sashidhar Jagdishan',
    role: 'CEO',
    action: 'Sell',
    shares: 8500,
    value: 12750000,
    date: '2023-06-08',
    changeInHolding: -3.1
  },
  {
    company: 'Tata Consultancy Services',
    symbol: 'TCS',
    insider: 'Rajesh Gopinathan',
    role: 'Former CEO',
    action: 'Sell',
    shares: 12000,
    value: 39600000,
    date: '2023-06-05',
    changeInHolding: -8.5
  },
  {
    company: 'Bharti Airtel',
    symbol: 'BHARTIARTL',
    insider: 'Sunil Mittal',
    role: 'Chairman',
    action: 'Buy',
    shares: 75000,
    value: 60000000,
    date: '2023-06-01',
    changeInHolding: 1.2
  }
];

// Mock options flow data
const OPTIONS_FLOW = [
  {
    time: '10:32:45',
    symbol: 'NIFTY',
    strike: 22800,
    type: 'Call',
    expiry: '29-Jun-2023',
    premium: 1250000,
    openInterest: 15420,
    openInterestChange: 2850,
    sentiment: 'Bullish',
    unusual: true
  },
  {
    time: '10:28:12',
    symbol: 'RELIANCE',
    strike: 2550,
    type: 'Call',
    expiry: '29-Jun-2023',
    premium: 875000,
    openInterest: 8750,
    openInterestChange: 1250,
    sentiment: 'Bullish',
    unusual: true
  },
  {
    time: '10:15:38',
    symbol: 'BANKNIFTY',
    strike: 48500,
    type: 'Put',
    expiry: '29-Jun-2023',
    premium: 950000,
    openInterest: 12350,
    openInterestChange: 1850,
    sentiment: 'Bearish',
    unusual: true
  },
  {
    time: '10:08:22',
    symbol: 'INFY',
    strike: 1450,
    type: 'Put',
    expiry: '29-Jun-2023',
    premium: 325000,
    openInterest: 5280,
    openInterestChange: 780,
    sentiment: 'Bearish',
    unusual: false
  },
  {
    time: '10:02:55',
    symbol: 'HDFCBANK',
    strike: 1650,
    type: 'Call',
    expiry: '29-Jun-2023',
    premium: 420000,
    openInterest: 6850,
    openInterestChange: 950,
    sentiment: 'Bullish',
    unusual: false
  }
];

export default function AlternativeData() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSource, setSelectedSource] = useState('sentiment');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter data sources based on search query and category
  const filteredDataSources = DATA_SOURCES.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          source.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || source.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['All', ...new Set(DATA_SOURCES.map(source => source.category))];

  // Handle source selection
  const handleSourceSelect = (sourceId) => {
    setSelectedSource(sourceId);
    setActiveTab('overview');
  };

  // Render data source card
  const renderDataSourceCard = (source) => {
    return (
      <div
        key={source.id}
        className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
          selectedSource === source.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => handleSourceSelect(source.id)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
              {source.icon}
            </div>
            <h3 className="ml-3 font-medium">{source.name}</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            source.price === 'Basic' ? 'bg-green-100 text-green-800' :
            source.price === 'Premium' ? 'bg-blue-100 text-blue-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {source.price}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{source.description}</p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{source.category}</span>
          <span>{source.updateFrequency}</span>
        </div>
      </div>
    );
  };

  // Render sentiment data
  const renderSentimentData = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Market Sentiment Overview</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-36 w-36">
                <div className={`h-36 w-36 rounded-full flex items-center justify-center border-8 ${
                  SENTIMENT_DATA.overview.score >= 70 ? 'border-green-500' :
                  SENTIMENT_DATA.overview.score >= 40 ? 'border-yellow-500' :
                  'border-red-500'
                }`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{SENTIMENT_DATA.overview.score}</div>
                    <div className="text-sm text-gray-500">Sentiment Score</div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center">
                  <div className={`text-sm font-bold ${SENTIMENT_DATA.overview.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {SENTIMENT_DATA.overview.change >= 0 ? '+' : ''}{SENTIMENT_DATA.overview.change}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Trend:</div>
              <div className="font-medium">{SENTIMENT_DATA.overview.trend}</div>
              <div className="text-gray-600">Volume:</div>
              <div className="font-medium">{SENTIMENT_DATA.overview.volume}</div>
              <div className="text-gray-600">Last Update:</div>
              <div className="font-medium">{SENTIMENT_DATA.overview.lastUpdate}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Sentiment by Source</h3>
            <div className="space-y-4">
              {Object.entries(SENTIMENT_DATA.sources).map(([source, data]) => (
                <div key={source} className="flex items-center">
                  <div className="w-24 text-sm capitalize">{source}</div>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          data.sentiment >= 70 ? 'bg-green-500' :
                          data.sentiment >= 40 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${data.sentiment}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-sm font-medium text-right">{data.sentiment}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              * Weighted by volume and engagement metrics
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Top Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {SENTIMENT_DATA.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={`text-sm px-2 py-1 rounded-full ${
                    keyword.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    keyword.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                  style={{ fontSize: `${Math.max(0.7, Math.min(1.2, 0.8 + keyword.count / 2000))}rem` }}
                >
                  {keyword.word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-medium mb-3">Top Stocks by Sentiment</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {SENTIMENT_DATA.topStocks.map((stock, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              stock.sentiment >= 70 ? 'bg-green-500' :
                              stock.sentiment >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${stock.sentiment}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{stock.sentiment}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.volume}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-3">Sentiment Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Sentiment trend chart would be displayed here</p>
          </div>
        </div>
      </div>
    );
  };

  // Render insider trading data
  const renderInsiderData = () => {
    return (
      <div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-medium mb-3">Recent Insider Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {INSIDER_DATA.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.company}</div>
                      <div className="text-xs text-gray-500">{transaction.symbol}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.insider}</div>
                      <div className="text-xs text-gray-500">{transaction.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.action === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.shares.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(transaction.value / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={transaction.changeInHolding >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {transaction.changeInHolding >= 0 ? '+' : ''}{transaction.changeInHolding}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Insider Trading Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Insider trading trend chart would be displayed here</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Buy/Sell Ratio by Sector</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Buy/sell ratio chart would be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render options flow data
  const renderOptionsData = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Options Flow Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Call/Put Ratio</span>
                  <span className="text-sm font-medium">1.8</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Bullish Flow</span>
                  <span className="text-sm font-medium">64%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Bearish Flow</span>
                  <span className="text-sm font-medium">36%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '36%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Unusual Activity</span>
                  <span className="text-sm font-medium">High</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Top Symbols</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">NIFTY</div>
                <div className="flex-1 mx-2">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm text-green-600 font-medium">+85% Calls</div>
              </div>

              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">RELIANCE</div>
                <div className="flex-1 mx-2">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm text-green-600 font-medium">+72% Calls</div>
              </div>

              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">BANKNIFTY</div>
                <div className="flex-1 mx-2">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm text-red-600 font-medium">+65% Puts</div>
              </div>

              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">INFY</div>
                <div className="flex-1 mx-2">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm text-red-600 font-medium">+58% Puts</div>
              </div>

              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">HDFCBANK</div>
                <div className="flex-1 mx-2">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm text-green-600 font-medium">+62% Calls</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Options Heatmap</h3>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Options heatmap would be displayed here</p>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              * Showing NIFTY options open interest distribution
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-medium mb-3">Recent Unusual Options Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strike</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium (₹)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OI Change</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {OPTIONS_FLOW.map((flow, index) => (
                  <tr key={index} className={`hover:bg-gray-50 ${flow.unusual ? 'bg-yellow-50' : ''}`}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{flow.time}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{flow.symbol}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{flow.strike}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        flow.type === 'Call' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {flow.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{flow.expiry}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {(flow.premium / 100000).toFixed(2)}L
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className="text-green-600">+{flow.openInterestChange}</span>
                      <span className="text-xs text-gray-500 ml-1">({(flow.openInterestChange / flow.openInterest * 100).toFixed(1)}%)</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        flow.sentiment === 'Bullish' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {flow.sentiment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-3">Options Flow Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Options flow trend chart would be displayed here</p>
          </div>
        </div>
      </div>
    );
  };

  // Render content based on selected source and tab
  const renderContent = () => {
    if (selectedSource === 'sentiment') {
      return renderSentimentData();
    } else if (selectedSource === 'insider') {
      return renderInsiderData();
    } else if (selectedSource === 'options') {
      return renderOptionsData();
    } else {
      return (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
          <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-blue-800">Data Source Preview</h3>
          <p className="mt-1 text-sm text-blue-600">
            This data source is available in the {DATA_SOURCES.find(s => s.id === selectedSource)?.price} plan.
            Upgrade your subscription to access this alternative data.
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Upgrade Subscription
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <PageLayout
      title="📊 Alternative Data"
      subtitle="Access premium alternative data sources for enhanced trading insights"
    >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                NSE
              </div>
              <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <span className="h-2 w-2 bg-purple-500 rounded-full mr-1.5"></span>
                Premium Data
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-lg font-medium mb-2 md:mb-0">Alternative Data Sources</h2>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search data sources..."
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <select
                  className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredDataSources.map(source => renderDataSourceCard(source))}
            </div>
          </div>

          {/* Data Source Content */}
          {selectedSource && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                    {DATA_SOURCES.find(s => s.id === selectedSource)?.icon}
                  </div>
                  <h2 className="ml-3 text-xl font-semibold">
                    {DATA_SOURCES.find(s => s.id === selectedSource)?.name}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Updated: 2 minutes ago</span>
                  <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('trends')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'trends'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Trends
                  </button>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'alerts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Set Alerts
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'settings'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Settings
                  </button>
                </nav>
              </div>

              {/* Content */}
              {renderContent()}
            </div>
          )}

          {/* Alternative Data Info */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">About Alternative Data</h2>
            <p className="text-gray-600 mb-4">
              Alternative data provides unique insights beyond traditional market data, giving you an edge in identifying trading opportunities and market trends.
              Our platform integrates multiple alternative data sources to enhance your trading decisions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <h3 className="ml-3 font-medium">Sentiment Analysis</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Track market sentiment from social media, news, and other sources to identify potential market movements before they happen.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <h3 className="ml-3 font-medium">Insider Activity</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Follow legal insider trading patterns to understand how company executives and directors view their own company's prospects.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <h3 className="ml-3 font-medium">Options Flow</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Monitor unusual options activity to detect where smart money is placing bets, potentially signaling upcoming price movements.
                </p>
              </div>
            </div>
          </div>
    </PageLayout>
  );
}
