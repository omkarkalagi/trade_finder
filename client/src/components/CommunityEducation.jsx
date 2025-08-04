import React, { useState } from 'react';
import PageLayout from './PageLayout';

// Mock strategy marketplace data
const STRATEGIES = [
  {
    id: 1,
    title: "Momentum Breakout Scanner",
    author: "TradeMaster365",
    authorRating: 4.8,
    description: "Identifies stocks breaking out of consolidation patterns with increasing volume",
    category: "Momentum",
    timeframe: "Intraday",
    markets: ["NSE", "BSE"],
    price: 2999,
    rating: 4.7,
    reviews: 128,
    downloads: 1250,
    lastUpdated: "2023-06-10",
    tags: ["Breakout", "Volume", "Momentum", "Swing Trading"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Gap & Go Strategy",
    author: "ProfitHunter",
    authorRating: 4.6,
    description: "Scans for stocks gapping up on news with potential for continuation",
    category: "Gap Trading",
    timeframe: "Daily",
    markets: ["NSE"],
    price: 1499,
    rating: 4.5,
    reviews: 86,
    downloads: 950,
    lastUpdated: "2023-06-05",
    tags: ["Gap", "News", "Momentum", "Day Trading"],
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&h=200&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Relative Strength Leader Finder",
    author: "MarketWizard",
    authorRating: 4.9,
    description: "Identifies stocks outperforming their sector and the broader market",
    category: "Relative Strength",
    timeframe: "Weekly",
    markets: ["NSE", "BSE", "US"],
    price: 3499,
    rating: 4.9,
    reviews: 215,
    downloads: 1850,
    lastUpdated: "2023-06-15",
    tags: ["Relative Strength", "Sector Analysis", "Swing Trading"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 4,
    title: "Options Flow Analyzer",
    author: "DerivativesPro",
    authorRating: 4.7,
    description: "Tracks unusual options activity and smart money movements",
    category: "Options",
    timeframe: "Intraday",
    markets: ["NSE", "US"],
    price: 4999,
    rating: 4.6,
    reviews: 92,
    downloads: 780,
    lastUpdated: "2023-06-12",
    tags: ["Options", "Unusual Activity", "Smart Money"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 5,
    title: "Mean Reversion Scanner",
    author: "StatTrader",
    authorRating: 4.5,
    description: "Finds oversold stocks likely to revert to their mean",
    category: "Mean Reversion",
    timeframe: "Daily",
    markets: ["NSE", "BSE"],
    price: 1999,
    rating: 4.3,
    reviews: 64,
    downloads: 620,
    lastUpdated: "2023-05-28",
    tags: ["Mean Reversion", "Oversold", "Swing Trading"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 6,
    title: "Ichimoku Cloud Strategy",
    author: "TechTrader",
    authorRating: 4.4,
    description: "Complete Ichimoku trading system with entry/exit signals",
    category: "Technical",
    timeframe: "Daily/Weekly",
    markets: ["NSE", "BSE", "US", "Crypto"],
    price: 2499,
    rating: 4.4,
    reviews: 78,
    downloads: 850,
    lastUpdated: "2023-06-01",
    tags: ["Ichimoku", "Technical", "Trend Following"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 7,
    title: "Earnings Surprise Detector",
    author: "FundamentalEdge",
    authorRating: 4.6,
    description: "Predicts potential earnings surprises based on historical patterns",
    category: "Fundamental",
    timeframe: "Quarterly",
    markets: ["NSE", "US"],
    price: 3999,
    rating: 4.5,
    reviews: 56,
    downloads: 480,
    lastUpdated: "2023-06-08",
    tags: ["Earnings", "Fundamental", "Swing Trading"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 8,
    title: "Volume Profile Trading System",
    author: "VolumeTrader",
    authorRating: 4.8,
    description: "Identifies key support/resistance levels using volume profile analysis",
    category: "Volume Analysis",
    timeframe: "Any",
    markets: ["NSE", "BSE", "US", "Futures"],
    price: 3499,
    rating: 4.8,
    reviews: 112,
    downloads: 1050,
    lastUpdated: "2023-06-18",
    tags: ["Volume Profile", "Support/Resistance", "Order Flow"],
    image: "https://via.placeholder.com/300x200"
  }
];

// Mock courses data
const COURSES = [
  {
    id: 1,
    title: "Technical Analysis Masterclass",
    instructor: "Rajesh Sharma",
    instructorTitle: "Former NSE Trader, 15+ Years Experience",
    description: "Comprehensive course covering all aspects of technical analysis for Indian markets",
    level: "Beginner to Advanced",
    duration: "24 hours",
    modules: 12,
    price: 4999,
    rating: 4.8,
    students: 3250,
    lastUpdated: "2023-05-15",
    tags: ["Technical Analysis", "Chart Patterns", "Indicators"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 2,
    title: "Options Trading Strategies",
    instructor: "Priya Patel",
    instructorTitle: "Options Specialist, Hedge Fund Analyst",
    description: "Learn advanced options strategies for consistent income generation",
    level: "Intermediate",
    duration: "18 hours",
    modules: 9,
    price: 5999,
    rating: 4.7,
    students: 1850,
    lastUpdated: "2023-06-02",
    tags: ["Options", "Income Strategies", "Risk Management"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 3,
    title: "Algorithmic Trading Fundamentals",
    instructor: "Vikram Mehta",
    instructorTitle: "Quant Developer, IIT Graduate",
    description: "Introduction to algorithmic trading concepts and implementation",
    level: "Intermediate to Advanced",
    duration: "30 hours",
    modules: 15,
    price: 7999,
    rating: 4.9,
    students: 1250,
    lastUpdated: "2023-06-10",
    tags: ["Algo Trading", "Python", "Backtesting"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 4,
    title: "Candlestick Patterns Decoded",
    instructor: "Amit Singh",
    instructorTitle: "Professional Trader, Trading Coach",
    description: "Master Japanese candlestick patterns for precise entry and exit points",
    level: "Beginner",
    duration: "12 hours",
    modules: 8,
    price: 2499,
    rating: 4.6,
    students: 4150,
    lastUpdated: "2023-05-20",
    tags: ["Candlesticks", "Price Action", "Chart Patterns"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 5,
    title: "Risk Management & Psychology",
    instructor: "Dr. Neha Kapoor",
    instructorTitle: "Trading Psychologist, Former Trader",
    description: "Essential psychological principles and risk management techniques for traders",
    level: "All Levels",
    duration: "15 hours",
    modules: 10,
    price: 3999,
    rating: 4.9,
    students: 2750,
    lastUpdated: "2023-06-05",
    tags: ["Psychology", "Risk Management", "Discipline"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 6,
    title: "Futures Trading Masterclass",
    instructor: "Rahul Desai",
    instructorTitle: "Professional Futures Trader",
    description: "Comprehensive guide to trading futures contracts in Indian markets",
    level: "Intermediate",
    duration: "20 hours",
    modules: 12,
    price: 5499,
    rating: 4.7,
    students: 1580,
    lastUpdated: "2023-05-28",
    tags: ["Futures", "Leverage", "Risk Management"],
    image: "https://via.placeholder.com/300x200"
  }
];

// Mock webinars data
const WEBINARS = [
  {
    id: 1,
    title: "Market Outlook: Q3 2023",
    presenter: "Sunil Singhania",
    presenterTitle: "Founder, Abakkus Asset Management",
    description: "Analysis of current market conditions and outlook for the next quarter",
    date: "2023-07-05",
    time: "18:00 IST",
    duration: "90 minutes",
    price: "Free",
    registrations: 1250,
    tags: ["Market Outlook", "Analysis", "Strategy"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 2,
    title: "Mastering Supply & Demand Zones",
    presenter: "Vishal Malkan",
    presenterTitle: "Professional Trader & Educator",
    description: "Identify high-probability trading opportunities using supply and demand zones",
    date: "2023-06-28",
    time: "19:00 IST",
    duration: "120 minutes",
    price: 999,
    registrations: 850,
    tags: ["Supply & Demand", "Price Action", "Trading Zones"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 3,
    title: "Options Expiry Strategies",
    presenter: "Nithin Kamath",
    presenterTitle: "Founder & CEO, Zerodha",
    description: "Effective strategies to trade during options expiry week",
    date: "2023-06-25",
    time: "17:00 IST",
    duration: "60 minutes",
    price: "Free",
    registrations: 2150,
    tags: ["Options", "Expiry", "Strategies"],
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 4,
    title: "Trading Psychology: Overcoming Fear & Greed",
    presenter: "Dr. Navneet Kaur",
    presenterTitle: "Trading Psychologist",
    description: "Practical techniques to master emotions and improve trading performance",
    date: "2023-07-10",
    time: "18:30 IST",
    duration: "90 minutes",
    price: 499,
    registrations: 720,
    tags: ["Psychology", "Emotions", "Discipline"],
    image: "https://via.placeholder.com/300x200"
  }
];

// Mock forum discussions
const DISCUSSIONS = [
  {
    id: 1,
    title: "How to identify strong support/resistance levels?",
    author: "trader123",
    category: "Technical Analysis",
    replies: 28,
    views: 1250,
    lastActivity: "2 hours ago",
    tags: ["Support/Resistance", "Technical Analysis"]
  },
  {
    id: 2,
    title: "Best broker for options trading in India?",
    author: "optionstrader",
    category: "Brokers & Platforms",
    replies: 42,
    views: 2150,
    lastActivity: "5 hours ago",
    tags: ["Brokers", "Options Trading"]
  },
  {
    id: 3,
    title: "NIFTY outlook for next week after RBI policy",
    author: "marketwatcher",
    category: "Market Analysis",
    replies: 35,
    views: 1850,
    lastActivity: "1 hour ago",
    tags: ["NIFTY", "RBI", "Market Outlook"]
  },
  {
    id: 4,
    title: "How to backtest strategies effectively?",
    author: "algotrader",
    category: "Algorithmic Trading",
    replies: 19,
    views: 980,
    lastActivity: "12 hours ago",
    tags: ["Backtesting", "Strategy Development"]
  },
  {
    id: 5,
    title: "Managing risk in volatile markets",
    author: "riskaverse",
    category: "Risk Management",
    replies: 31,
    views: 1450,
    lastActivity: "3 hours ago",
    tags: ["Risk Management", "Volatility"]
  },
  {
    id: 6,
    title: "Tax implications of intraday trading",
    author: "taxplanner",
    category: "Trading & Taxes",
    replies: 24,
    views: 1320,
    lastActivity: "8 hours ago",
    tags: ["Taxes", "Intraday Trading"]
  }
];

export default function CommunityEducation() {
  const [activeTab, setActiveTab] = useState('strategies');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Get unique categories for filter
  const getCategories = (items, categoryKey) => {
    return ['All', ...new Set(items.map(item => item[categoryKey]))];
  };

  const strategyCategories = getCategories(STRATEGIES, 'category');
  const courseCategories = ['All', 'Technical Analysis', 'Fundamental Analysis', 'Options', 'Futures', 'Risk Management', 'Psychology'];

  // Filter and sort strategies
  const filteredStrategies = STRATEGIES.filter(strategy => {
    const matchesSearch = strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          strategy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          strategy.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || strategy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.downloads - a.downloads;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  // Filter and sort courses
  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || course.tags.some(tag => tag === categoryFilter);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.students - a.students;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  // Render strategy card
  const renderStrategyCard = (strategy) => {
    return (
      <div
        key={strategy.id}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setSelectedStrategy(strategy)}
      >
        <img src={strategy.image} alt={strategy.title} className="w-full h-40 object-cover" />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium">{strategy.title}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {strategy.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{strategy.description}</p>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-1">★</div>
              <span className="text-sm font-medium">{strategy.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({strategy.reviews})</span>
            </div>
            <div className="text-sm font-medium">₹{strategy.price.toLocaleString()}</div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>By {strategy.author}</div>
            <div>{strategy.downloads} downloads</div>
          </div>
        </div>
      </div>
    );
  };

  // Render course card
  const renderCourseCard = (course) => {
    return (
      <div
        key={course.id}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setSelectedCourse(course)}
      >
        <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-medium mb-1">{course.title}</h3>
          <div className="text-sm text-gray-600 mb-2">{course.instructor}</div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-1">★</div>
              <span className="text-sm font-medium">{course.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({course.students} students)</span>
            </div>
            <div className="text-sm font-medium">₹{course.price.toLocaleString()}</div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">{course.level}</span>
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">{course.duration}</span>
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">{course.modules} modules</span>
          </div>
        </div>
      </div>
    );
  };

  // Render webinar card
  const renderWebinarCard = (webinar) => {
    return (
      <div key={webinar.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <img src={webinar.image} alt={webinar.title} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-medium mb-1">{webinar.title}</h3>
          <div className="text-sm text-gray-600 mb-2">{webinar.presenter}</div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{webinar.description}</p>
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div>
              <div className="text-gray-500">Date</div>
              <div className="font-medium">{webinar.date}</div>
            </div>
            <div>
              <div className="text-gray-500">Time</div>
              <div className="font-medium">{webinar.time}</div>
            </div>
            <div>
              <div className="text-gray-500">Duration</div>
              <div className="font-medium">{webinar.duration}</div>
            </div>
            <div>
              <div className="text-gray-500">Price</div>
              <div className="font-medium">{webinar.price === 'Free' ? 'Free' : `₹${webinar.price}`}</div>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
            Register Now
          </button>
          <div className="text-xs text-gray-500 text-center mt-2">
            {webinar.registrations} people registered
          </div>
        </div>
      </div>
    );
  };

  // Render discussion row
  const renderDiscussionRow = (discussion) => {
    return (
      <div key={discussion.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium mb-1">{discussion.title}</h3>
            <div className="text-sm text-gray-600 mb-2">Posted by {discussion.author}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {discussion.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mb-1">
              {discussion.category}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{discussion.replies}</span> replies
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{discussion.views}</span> views
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last activity: {discussion.lastActivity}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render strategy details
  const renderStrategyDetails = () => {
    if (!selectedStrategy) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{selectedStrategy.title}</h2>
            <button
              onClick={() => setSelectedStrategy(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <img src={selectedStrategy.image} alt={selectedStrategy.title} className="w-full h-64 object-cover rounded-lg mb-4" />

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-600">{selectedStrategy.description}</p>
                <p className="text-gray-600 mt-2">
                  This strategy is designed to help traders identify high-probability trading opportunities in the Indian markets.
                  It combines multiple technical indicators and price action patterns to generate reliable signals.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Customizable scanner parameters to fit your trading style</li>
                  <li>Real-time alerts for new trading opportunities</li>
                  <li>Detailed entry and exit rules with stop-loss recommendations</li>
                  <li>Compatible with NSE and BSE stocks</li>
                  <li>Includes backtesting results from 2018-2023</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Performance Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Win Rate</div>
                    <div className="text-xl font-bold text-green-600">68%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Avg. Profit</div>
                    <div className="text-xl font-bold text-green-600">2.8%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Avg. Loss</div>
                    <div className="text-xl font-bold text-red-600">1.2%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Profit Factor</div>
                    <div className="text-xl font-bold">2.3</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">User Reviews</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Trader123</div>
                      <div className="flex text-yellow-400">★★★★★</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      This strategy has completely transformed my trading. The signals are accurate and the risk management rules are excellent.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">InvestorPro</div>
                      <div className="flex text-yellow-400">★★★★<span className="text-gray-300">★</span></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Very good strategy overall. Works best in trending markets but struggles a bit in choppy conditions.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">MarketWizard</div>
                      <div className="flex text-yellow-400">★★★★★</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Excellent strategy with clear rules. The author provides great support and regular updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-4 rounded-lg sticky top-4">
                <div className="text-2xl font-bold mb-2">₹{selectedStrategy.price.toLocaleString()}</div>

                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 mr-1">★</div>
                  <span className="text-sm font-medium">{selectedStrategy.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({selectedStrategy.reviews} reviews)</span>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mb-3 hover:bg-blue-700 transition-colors">
                  Buy Now
                </button>

                <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium mb-4 hover:bg-gray-300 transition-colors">
                  Add to Cart
                </button>

                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Author</span>
                    <span className="font-medium">{selectedStrategy.author}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Author Rating</span>
                    <span className="font-medium">{selectedStrategy.authorRating} ★</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Category</span>
                    <span className="font-medium">{selectedStrategy.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Timeframe</span>
                    <span className="font-medium">{selectedStrategy.timeframe}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Markets</span>
                    <span className="font-medium">{selectedStrategy.markets.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Last Updated</span>
                    <span className="font-medium">{selectedStrategy.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Downloads</span>
                    <span className="font-medium">{selectedStrategy.downloads}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedStrategy.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>

                <div className="text-xs text-gray-500">
                  30-day money-back guarantee if not satisfied with the strategy performance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render course details
  const renderCourseDetails = () => {
    if (!selectedCourse) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-64 object-cover rounded-lg mb-4" />

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">About This Course</h3>
                <p className="text-gray-600">{selectedCourse.description}</p>
                <p className="text-gray-600 mt-2">
                  This comprehensive course is designed for traders of all levels who want to master the art and science of technical analysis.
                  You'll learn how to identify profitable trading opportunities using various technical tools and indicators.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>How to read and interpret different chart patterns</li>
                  <li>Using technical indicators effectively without overcomplicating your analysis</li>
                  <li>Identifying key support and resistance levels</li>
                  <li>Creating a trading plan based on technical analysis</li>
                  <li>Risk management techniques to protect your capital</li>
                  <li>Real-world case studies and practical examples</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Course Content</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Module 1: Introduction to Technical Analysis</div>
                      <div className="text-sm text-gray-500">3 lessons (2 hours)</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Module 2: Chart Types and Timeframes</div>
                      <div className="text-sm text-gray-500">4 lessons (2.5 hours)</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Module 3: Trend Analysis</div>
                      <div className="text-sm text-gray-500">5 lessons (3 hours)</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Module 4: Support and Resistance</div>
                      <div className="text-sm text-gray-500">4 lessons (2.5 hours)</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Module 5: Chart Patterns</div>
                      <div className="text-sm text-gray-500">6 lessons (4 hours)</div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-blue-600 mt-2">
                    + 7 more modules
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Student Feedback</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Rahul M.</div>
                      <div className="flex text-yellow-400">★★★★★</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Excellent course! The instructor explains complex concepts in a simple and easy-to-understand manner.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Priya S.</div>
                      <div className="flex text-yellow-400">★★★★<span className="text-gray-300">★</span></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Very comprehensive course with practical examples. Would have liked more Indian market specific examples.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Vikram D.</div>
                      <div className="flex text-yellow-400">★★★★★</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      This course transformed my trading approach. The risk management section alone is worth the price.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-4 rounded-lg sticky top-4">
                <div className="text-2xl font-bold mb-2">₹{selectedCourse.price.toLocaleString()}</div>

                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 mr-1">★</div>
                  <span className="text-sm font-medium">{selectedCourse.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({selectedCourse.students} students)</span>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mb-3 hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>

                <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium mb-4 hover:bg-gray-300 transition-colors">
                  Add to Wishlist
                </button>

                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Instructor</span>
                    <span className="font-medium">{selectedCourse.instructor}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Level</span>
                    <span className="font-medium">{selectedCourse.level}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Duration</span>
                    <span className="font-medium">{selectedCourse.duration}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Modules</span>
                    <span className="font-medium">{selectedCourse.modules}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Last Updated</span>
                    <span className="font-medium">{selectedCourse.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Students</span>
                    <span className="font-medium">{selectedCourse.students}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedCourse.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>

                <div className="text-xs text-gray-500">
                  <div className="mb-1">This course includes:</div>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lifetime access
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mobile and TV access
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Certificate of completion
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Downloadable resources
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render strategies tab
  const renderStrategiesTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredStrategies.map(strategy => renderStrategyCard(strategy))}
        </div>

        {filteredStrategies.length === 0 && (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No strategies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {selectedStrategy && renderStrategyDetails()}
      </div>
    );
  };

  // Render courses tab
  const renderCoursesTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map(course => renderCourseCard(course))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {selectedCourse && renderCourseDetails()}
      </div>
    );
  };

  // Render webinars tab
  const renderWebinarsTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WEBINARS.map(webinar => renderWebinarCard(webinar))}
        </div>
      </div>
    );
  };

  // Render forum tab
  const renderForumTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Discussion Forum</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            New Discussion
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium mb-2">Popular Categories</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Technical Analysis</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Market Analysis</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Options Trading</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Risk Management</span>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Trading Psychology</span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">Algorithmic Trading</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {DISCUSSIONS.map(discussion => renderDiscussionRow(discussion))}
        </div>

        <div className="mt-6 flex justify-center">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors">
            Load More Discussions
          </button>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      title="👥 Community & Education"
      subtitle="Learn from experts, share strategies, and grow your trading knowledge"
    >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-500/30">
                NSE
              </div>
              <div className="bg-purple-500/20 text-purple-400 text-xs font-medium px-2.5 py-1 rounded-full flex items-center border border-purple-500/30">
                <span className="h-2 w-2 bg-purple-400 rounded-full mr-1.5"></span>
                Premium
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('strategies')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'strategies'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Strategy Marketplace
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'courses'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab('webinars')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'webinars'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Webinars
                </button>
                <button
                  onClick={() => setActiveTab('forum')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'forum'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Discussion Forum
                </button>
              </nav>
            </div>

            {/* Search and Filter */}
            {(activeTab === 'strategies' || activeTab === 'courses') && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="relative mb-4 md:mb-0 md:w-1/3">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === 'strategies' ? 'strategies' : 'courses'}...`}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <select
                    className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {(activeTab === 'strategies' ? strategyCategories : courseCategories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'strategies' && renderStrategiesTab()}
            {activeTab === 'courses' && renderCoursesTab()}
            {activeTab === 'webinars' && renderWebinarsTab()}
            {activeTab === 'forum' && renderForumTab()}
          </div>

          {/* Community & Education Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">About Community & Education</h2>
            <p className="text-gray-600 mb-4">
              Our Community & Education hub connects you with fellow traders and provides access to premium trading strategies, courses, and educational resources.
              Learn from experts, share your knowledge, and take your trading skills to the next level.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <h3 className="ml-3 font-medium">Strategy Marketplace</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Discover and purchase proven trading strategies created by successful traders. Implement these strategies in your own trading.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <h3 className="ml-3 font-medium">Learning Resources</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Access comprehensive courses, webinars, and educational content to enhance your trading knowledge and skills.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <h3 className="ml-3 font-medium">Trader Community</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Connect with like-minded traders, participate in discussions, and share insights in our active trading community.
                </p>
              </div>
            </div>
          </div>
    </PageLayout>
  );
}
