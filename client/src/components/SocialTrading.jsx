import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import alpacaService from '../services/alpacaService';
import notificationService from '../services/notificationService';

// Famous Indian traders and investors
const TOP_TRADERS = [
  {
    id: 1,
    name: 'Radhakishan Damani',
    username: 'rk_damani_official',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    performance: {
      monthly: 24.7,
      total: 2847.5,
      winRate: 89,
      avgTrade: 15.3,
      followers: 125000
    },
    strategy: 'Value Investing',
    risk: 'Low',
    trades: {
      total: 1247,
      won: 1109,
      lost: 138
    },
    verified: true,
    subscription: {
      monthly: 4999,
      quarterly: 12999,
      yearly: 45999
    },
    bio: 'Founder of DMart, India\'s retail king and legendary value investor with 30+ years of market experience',
    expertise: ['Retail Stocks', 'FMCG', 'Long-term Value', 'Quality Growth'],
    recentTrades: [
      { symbol: 'DMART', action: 'BUY', quantity: 500, price: 3456.78, date: '2025-01-15' },
      { symbol: 'HINDUNILVR', action: 'BUY', quantity: 200, price: 2456.90, date: '2025-01-14' }
    ]
  },
  {
    id: 2,
    name: 'Mukesh Ambani',
    username: 'ambani_trades',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    performance: {
      monthly: 18.4,
      total: 1598.3,
      winRate: 82,
      avgTrade: 12.1,
      followers: 89000
    },
    strategy: 'Growth & Technology',
    risk: 'Medium',
    trades: {
      total: 864,
      won: 708,
      lost: 156
    },
    verified: true,
    subscription: {
      monthly: 7999,
      quarterly: 19999,
      yearly: 69999
    },
    bio: 'Chairman of Reliance Industries, visionary leader in energy, telecom, and digital transformation',
    expertise: ['Energy Stocks', 'Telecom', 'Petrochemicals', 'Digital Economy'],
    recentTrades: [
      { symbol: 'RELIANCE', action: 'BUY', quantity: 1000, price: 2567.80, date: '2025-01-15' },
      { symbol: 'JIOFINANCIAL', action: 'BUY', quantity: 2000, price: 345.60, date: '2025-01-14' }
    ]
  },
  {
    id: 3,
    name: 'Rakesh Jhunjhunwala',
    username: 'big_bull_rj',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    performance: {
      monthly: 32.4,
      total: 4298.7,
      winRate: 76,
      avgTrade: 18.9,
      followers: 156000
    },
    strategy: 'Growth Momentum',
    risk: 'High',
    trades: {
      total: 2156,
      won: 1638,
      lost: 518
    },
    verified: true,
    subscription: {
      monthly: 9999,
      quarterly: 24999,
      yearly: 89999
    },
    bio: 'The Big Bull of Indian stock market, legendary investor with unmatched market intuition',
    expertise: ['Mid-cap Growth', 'Momentum Stocks', 'Market Timing', 'Multibaggers'],
    recentTrades: [
      { symbol: 'TITAN', action: 'BUY', quantity: 300, price: 3234.50, date: '2025-01-15' },
      { symbol: 'CRISIL', action: 'SELL', quantity: 150, price: 4567.80, date: '2025-01-13' }
    ]
  },
  {
    id: 4,
    name: 'Porinju Veliyath',
    username: 'porinju_official',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    performance: {
      monthly: 28.7,
      total: 1847.2,
      winRate: 71,
      avgTrade: 14.6,
      followers: 67000
    },
    strategy: 'Small & Mid Cap',
    risk: 'High',
    trades: {
      total: 1456,
      won: 1033,
      lost: 423
    },
    verified: true,
    subscription: {
      monthly: 3999,
      quarterly: 9999,
      yearly: 34999
    },
    bio: 'Founder of Equity Intelligence, small-cap specialist',
    expertise: ['Small-cap', 'Mid-cap', 'Undervalued stocks']
  },
  {
    id: 5,
    name: 'Dolly Khanna',
    username: 'dolly_khanna_picks',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    performance: {
      monthly: 21.8,
      total: 1256.4,
      winRate: 84,
      avgTrade: 11.2,
      followers: 45000
    },
    strategy: 'Value Investing',
    risk: 'Medium',
    trades: {
      total: 756,
      won: 635,
      lost: 121
    },
    verified: true,
    subscription: {
      monthly: 2999,
      quarterly: 7999,
      yearly: 27999
    },
    bio: 'Chennai-based value investor, known for multibagger picks and contrarian investing',
    expertise: ['Small-cap Value', 'Contrarian Picks', 'Hidden Gems', 'Quality Stocks'],
    recentTrades: [
      { symbol: 'RAIN', action: 'BUY', quantity: 1000, price: 156.78, date: '2025-01-14' },
      { symbol: 'MANAPPURAM', action: 'BUY', quantity: 500, price: 145.60, date: '2025-01-13' }
    ]
  },
  {
    id: 6,
    name: 'Ashish Kacholia',
    username: 'ashish_kacholia',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    performance: {
      monthly: 26.3,
      total: 1689.8,
      winRate: 78,
      avgTrade: 13.7,
      followers: 52000
    },
    strategy: 'Growth Investing',
    risk: 'Medium',
    trades: {
      total: 987,
      won: 770,
      lost: 217
    },
    verified: true,
    subscription: {
      monthly: 4499,
      quarterly: 11999,
      yearly: 39999
    },
    bio: 'Ace investor known for identifying growth stories early',
    expertise: ['Growth stocks', 'Emerging sectors', 'Quality picks']
  },
  {
    id: 3,
    name: 'Vikram Singh',
    username: 'swing_trader',
    avatar: 'VS',
    performance: {
      monthly: 12.8,
      total: 76.5,
      winRate: 65,
      avgTrade: 1.8,
      followers: 542
    },
    strategy: 'Swing Trading',
    risk: 'Low',
    trades: {
      total: 52,
      won: 34,
      lost: 18
    },
    verified: true,
    subscription: {
      monthly: 799,
      quarterly: 1999,
      yearly: 6999
    }
  },
  {
    id: 4,
    name: 'Ananya Gupta',
    username: 'intraday_pro',
    avatar: 'AG',
    performance: {
      monthly: 15.2,
      total: 112.7,
      winRate: 63,
      avgTrade: 2.5,
      followers: 923
    },
    strategy: 'Intraday Trading',
    risk: 'Medium',
    trades: {
      total: 95,
      won: 60,
      lost: 35
    },
    verified: false,
    subscription: {
      monthly: 899,
      quarterly: 2299,
      yearly: 7999
    }
  },
  {
    id: 5,
    name: 'Arjun Mehta',
    username: 'value_investor',
    avatar: 'AM',
    performance: {
      monthly: 8.5,
      total: 187.3,
      winRate: 82,
      avgTrade: 1.2,
      followers: 1876
    },
    strategy: 'Value Investing',
    risk: 'Low',
    trades: {
      total: 38,
      won: 31,
      lost: 7
    },
    verified: true,
    subscription: {
      monthly: 1299,
      quarterly: 3499,
      yearly: 11999
    }
  },
  {
    id: 6,
    name: 'Neha Kapoor',
    username: 'tech_analyst',
    avatar: 'NK',
    performance: {
      monthly: 19.8,
      total: 89.4,
      winRate: 70,
      avgTrade: 2.7,
      followers: 654
    },
    strategy: 'Technical Analysis',
    risk: 'Medium',
    trades: {
      total: 73,
      won: 51,
      lost: 22
    },
    verified: false,
    subscription: {
      monthly: 899,
      quarterly: 2299,
      yearly: 7999
    }
  }
];

// Mock recent trades
const RECENT_TRADES = [
  {
    id: 1,
    trader: 'nifty_master',
    symbol: 'NIFTY',
    type: 'Buy',
    entry: 22845.30,
    exit: 22950.75,
    profit: 105.45,
    profitPercent: 0.46,
    date: '2023-06-15',
    time: '10:32 AM'
  },
  {
    id: 2,
    trader: 'options_queen',
    symbol: 'BANKNIFTY',
    type: 'Sell',
    entry: 48650.75,
    exit: 48520.30,
    profit: 130.45,
    profitPercent: 0.27,
    date: '2023-06-15',
    time: '11:15 AM'
  },
  {
    id: 3,
    trader: 'swing_trader',
    symbol: 'RELIANCE',
    type: 'Buy',
    entry: 2567.80,
    exit: 2598.45,
    profit: 30.65,
    profitPercent: 1.19,
    date: '2023-06-14',
    time: '02:45 PM'
  },
  {
    id: 4,
    trader: 'intraday_pro',
    symbol: 'INFY',
    type: 'Buy',
    entry: 1456.25,
    exit: 1442.70,
    profit: -13.55,
    profitPercent: -0.93,
    date: '2023-06-14',
    time: '01:20 PM'
  },
  {
    id: 5,
    trader: 'value_investor',
    symbol: 'HDFCBANK',
    type: 'Buy',
    entry: 1678.50,
    exit: 1695.30,
    profit: 16.80,
    profitPercent: 1.00,
    date: '2023-06-13',
    time: '03:10 PM'
  }
];

// Mock trader performance data for chart
const PERFORMANCE_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Monthly Returns (%)',
      data: [5.2, 8.7, -2.3, 12.5, 7.8, 18.7]
    }
  ]
};

export default function SocialTrading() {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('monthly');
  const [copySettings, setCopySettings] = useState({
    allocation: 10,
    maxRisk: 2,
    autoTrade: true,
    notifications: true
  });

  // Handle trader selection
  const handleTraderSelect = (trader) => {
    setSelectedTrader(trader);
  };

  // Handle copy settings change
  const handleCopySettingChange = (setting, value) => {
    setCopySettings({
      ...copySettings,
      [setting]: value
    });
  };

  // Render trader card
  const renderTraderCard = (trader) => {
    return (
      <div
        key={trader.id}
        className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
          selectedTrader?.id === trader.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => handleTraderSelect(trader)}
      >
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {trader.avatar}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900">{trader.name}</h3>
              {trader.verified && (
                <svg className="ml-1 h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500">@{trader.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Monthly Return</p>
            <p className="text-lg font-bold text-green-600">+{trader.performance.monthly}%</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Win Rate</p>
            <p className="text-lg font-bold text-blue-600">{trader.performance.winRate}%</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Strategy:</span>
            <span className="font-medium">{trader.strategy}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Risk Level:</span>
            <span className={`font-medium ${
              trader.risk === 'Low' ? 'text-green-600' :
              trader.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>{trader.risk}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Followers:</span>
            <span className="font-medium">{trader.performance.followers.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">From </span>
            <span className="font-medium">₹{trader.subscription.monthly}/mo</span>
          </div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
            View Profile
          </button>
        </div>
      </div>
    );
  };

  // Render trader profile
  const renderTraderProfile = () => {
    if (!selectedTrader) return null;

    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {selectedTrader.avatar}
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedTrader.name}</h2>
                {selectedTrader.verified && (
                  <svg className="ml-2 h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-gray-500">@{selectedTrader.username}</p>
              <div className="flex items-center mt-1">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {selectedTrader.strategy}
                </span>
                <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  selectedTrader.risk === 'Low' ? 'bg-green-100 text-green-800' :
                  selectedTrader.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedTrader.risk} Risk
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Follow
            </button>
            <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <h3 className="font-medium mb-3">Performance Overview</h3>
            <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Performance chart would be displayed here</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Total Return</p>
                <p className="text-lg font-bold text-green-600">+{selectedTrader.performance.total}%</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Monthly Return</p>
                <p className="text-lg font-bold text-green-600">+{selectedTrader.performance.monthly}%</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Win Rate</p>
                <p className="text-lg font-bold text-blue-600">{selectedTrader.performance.winRate}%</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Avg. Trade</p>
                <p className="text-lg font-bold text-green-600">+{selectedTrader.performance.avgTrade}%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Subscription Plans</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setSubscriptionPeriod('monthly')}
                  className={`px-3 py-1 rounded text-sm ${
                    subscriptionPeriod === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSubscriptionPeriod('quarterly')}
                  className={`px-3 py-1 rounded text-sm ${
                    subscriptionPeriod === 'quarterly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setSubscriptionPeriod('yearly')}
                  className={`px-3 py-1 rounded text-sm ${
                    subscriptionPeriod === 'yearly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Yearly
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Copy Trading</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-bold">₹{selectedTrader.subscription[subscriptionPeriod]}</span>
                  <span className="text-gray-500 text-sm">
                    {subscriptionPeriod === 'monthly' ? '/month' :
                     subscriptionPeriod === 'quarterly' ? '/quarter' : '/year'}
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Automatic trade copying
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time trade alerts
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Customizable risk settings
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Performance analytics
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Subscribe & Copy
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2">Alerts Only</h4>
                <div className="mb-3">
                  <span className="text-2xl font-bold">₹{Math.floor(selectedTrader.subscription[subscriptionPeriod] * 0.6)}</span>
                  <span className="text-gray-500 text-sm">
                    {subscriptionPeriod === 'monthly' ? '/month' :
                     subscriptionPeriod === 'quarterly' ? '/quarter' : '/year'}
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time trade alerts
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Trade rationale
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Performance analytics
                  </li>
                </ul>
                <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors">
                  Subscribe to Alerts
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Recent Trades</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {RECENT_TRADES.filter(trade => trade.trader === selectedTrader.username).map((trade) => (
                      <tr key={trade.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{trade.symbol}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹{trade.entry.toFixed(2)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹{trade.exit.toFixed(2)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)} ({trade.profit >= 0 ? '+' : ''}{trade.profitPercent.toFixed(2)}%)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Copy Trading Settings</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capital Allocation
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={copySettings.allocation}
                    onChange={(e) => handleCopySettingChange('allocation', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm font-medium">{copySettings.allocation}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Percentage of your capital to allocate to this trader's signals.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Risk Per Trade
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={copySettings.maxRisk}
                    onChange={(e) => handleCopySettingChange('maxRisk', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm font-medium">{copySettings.maxRisk}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum percentage of your capital to risk on any single trade.
                </p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Automatic Trade Execution
                  </label>
                  <p className="text-xs text-gray-500">
                    Automatically execute trades when signals are received.
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="auto-trade"
                    checked={copySettings.autoTrade}
                    onChange={(e) => handleCopySettingChange('autoTrade', e.target.checked)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="auto-trade"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      copySettings.autoTrade ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        copySettings.autoTrade ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Trade Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Receive notifications for all trade signals.
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={copySettings.notifications}
                    onChange={(e) => handleCopySettingChange('notifications', e.target.checked)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="notifications"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      copySettings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        copySettings.notifications ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                Save Settings & Start Copying
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">👥 Social Trading</h1>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                NSE
              </div>
              <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <span className="h-2 w-2 bg-purple-500 rounded-full mr-1.5"></span>
                Copy Trading
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'discover'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Discover Traders
                </button>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'following'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Following
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recent Activity
                </button>
                <button
                  onClick={() => setActiveTab('performance')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'performance'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Performance
                </button>
              </nav>
            </div>

            {/* Discover Traders Tab */}
            {activeTab === 'discover' && (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Top Performing Traders</h2>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search traders..."
                          className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      <select className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Sort by: Performance</option>
                        <option>Sort by: Win Rate</option>
                        <option>Sort by: Popularity</option>
                        <option>Sort by: Risk Level</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {TOP_TRADERS.map(trader => renderTraderCard(trader))}
                </div>

                {selectedTrader && renderTraderProfile()}
              </div>
            )}

            {/* Following Tab */}
            {activeTab === 'following' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium">Traders You're Following</h2>
                  <p className="text-gray-600 text-sm">
                    You're currently following and copying trades from these traders.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No traders followed yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start by discovering and following top traders to copy their trades.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Discover Traders
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium">Recent Trading Activity</h2>
                  <p className="text-gray-600 text-sm">
                    Recent trades from traders across the platform.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {RECENT_TRADES.map((trade) => (
                        <tr key={trade.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {trade.trader.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">@{trade.trader}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.symbol}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              trade.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {trade.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{trade.entry.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{trade.exit.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)} ({trade.profit >= 0 ? '+' : ''}{trade.profitPercent.toFixed(2)}%)
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {trade.date} at {trade.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-800">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* My Performance Tab */}
            {activeTab === 'performance' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium">Copy Trading Performance</h2>
                  <p className="text-gray-600 text-sm">
                    Track the performance of your copy trading activities.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No copy trading data yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start copying traders to see your performance metrics here.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Discover Traders
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* How Copy Trading Works */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">How Copy Trading Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <h3 className="ml-3 font-medium">Choose Traders</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Browse and select from our curated list of top-performing traders based on their trading style, performance, and risk profile.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <h3 className="ml-3 font-medium">Set Your Parameters</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Customize your risk level, capital allocation, and trading preferences to match your investment goals and risk tolerance.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <h3 className="ml-3 font-medium">Automatic Trading</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Our platform automatically executes trades on your behalf when your selected traders make moves, adjusted to your risk settings.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Copy trading allows you to leverage the expertise of successful traders while maintaining control over your risk exposure.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Learn More About Copy Trading
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
