import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import alpacaService from '../services/alpacaService';
import zerodhaService from '../services/zerodhaService';
import LoadingSpinner from './common/LoadingSpinner';

// Mock portfolio data
const PORTFOLIO_DATA = {
  summary: {
    totalValue: 1250000,
    dayChange: 15600,
    dayChangePercent: 1.26,
    totalReturn: 125000,
    totalReturnPercent: 11.1,
    cash: 175000
  },
  allocation: {
    sectors: [
      { name: 'Technology', value: 450000, percentage: 36, change: 2.8 },
      { name: 'Financial Services', value: 325000, percentage: 26, change: 0.7 },
      { name: 'Consumer Cyclical', value: 150000, percentage: 12, change: -1.2 },
      { name: 'Healthcare', value: 100000, percentage: 8, change: 1.5 },
      { name: 'Energy', value: 50000, percentage: 4, change: 3.2 },
      { name: 'Cash', value: 175000, percentage: 14, change: 0 }
    ],
    marketCap: [
      { name: 'Large Cap', value: 750000, percentage: 60 },
      { name: 'Mid Cap', value: 250000, percentage: 20 },
      { name: 'Small Cap', value: 75000, percentage: 6 },
      { name: 'Cash', value: 175000, percentage: 14 }
    ]
  },
  holdings: [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      shares: 150,
      avgPrice: 2450.75,
      currentPrice: 2567.80,
      value: 385170,
      dayChange: 1.8,
      totalReturn: 4.8,
      weight: 30.8,
      sector: 'Energy'
    },
    {
      symbol: 'INFY',
      name: 'Infosys Ltd',
      shares: 250,
      avgPrice: 1380.50,
      currentPrice: 1456.25,
      value: 364062.5,
      dayChange: 2.1,
      totalReturn: 5.5,
      weight: 29.1,
      sector: 'Technology'
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      shares: 180,
      avgPrice: 1620.30,
      currentPrice: 1678.50,
      value: 302130,
      dayChange: 0.7,
      totalReturn: 3.6,
      weight: 24.2,
      sector: 'Financial Services'
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services Ltd',
      shares: 75,
      avgPrice: 3250.25,
      currentPrice: 3420.60,
      value: 256545,
      dayChange: 1.2,
      totalReturn: 5.2,
      weight: 20.5,
      sector: 'Technology'
    },
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Ltd',
      shares: 300,
      avgPrice: 580.40,
      currentPrice: 565.20,
      value: 169560,
      dayChange: -1.2,
      totalReturn: -2.6,
      weight: 13.6,
      sector: 'Consumer Cyclical'
    },
    {
      symbol: 'SUNPHARMA',
      name: 'Sun Pharmaceutical Industries Ltd',
      shares: 120,
      avgPrice: 1020.75,
      currentPrice: 1050.30,
      value: 126036,
      dayChange: 1.5,
      totalReturn: 2.9,
      weight: 10.1,
      sector: 'Healthcare'
    }
  ],
  performance: {
    daily: [
      { date: '2023-06-12', value: 1225000 },
      { date: '2023-06-13', value: 1228000 },
      { date: '2023-06-14', value: 1235000 },
      { date: '2023-06-15', value: 1232000 },
      { date: '2023-06-16', value: 1240000 },
      { date: '2023-06-19', value: 1238000 },
      { date: '2023-06-20', value: 1245000 },
      { date: '2023-06-21', value: 1250000 }
    ],
    monthly: [
      { month: 'Jan', value: 1100000 },
      { month: 'Feb', value: 1125000 },
      { month: 'Mar', value: 1115000 },
      { month: 'Apr', value: 1150000 },
      { month: 'May', value: 1200000 },
      { month: 'Jun', value: 1250000 }
    ]
  },
  riskMetrics: {
    volatility: 12.5,
    beta: 0.85,
    sharpeRatio: 1.2,
    maxDrawdown: 8.5,
    correlationSP: 0.78,
    valueAtRisk: 3.2
  },
  transactions: [
    {
      id: 1,
      date: '2023-06-15',
      type: 'Buy',
      symbol: 'INFY',
      shares: 50,
      price: 1450.25,
      value: 72512.5,
      fees: 145
    },
    {
      id: 2,
      date: '2023-06-10',
      type: 'Sell',
      symbol: 'BHARTIARTL',
      shares: 100,
      price: 865.30,
      value: 86530,
      fees: 173
    },
    {
      id: 3,
      date: '2023-06-05',
      type: 'Buy',
      symbol: 'RELIANCE',
      shares: 25,
      price: 2520.75,
      value: 63018.75,
      fees: 126
    },
    {
      id: 4,
      date: '2023-05-28',
      type: 'Buy',
      symbol: 'TATAMOTORS',
      shares: 150,
      price: 575.50,
      value: 86325,
      fees: 173
    },
    {
      id: 5,
      date: '2023-05-20',
      type: 'Sell',
      symbol: 'WIPRO',
      shares: 200,
      price: 385.25,
      value: 77050,
      fees: 154
    }
  ]
};

// Mock watchlist data
const WATCHLIST_DATA = [
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    price: 945.30,
    change: 1.5,
    volume: 3250000,
    pe: 22.5,
    marketCap: 658000000000
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd',
    price: 6780.50,
    change: -0.8,
    volume: 1150000,
    pe: 35.2,
    marketCap: 410000000000
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd',
    price: 3250.75,
    change: 0.6,
    volume: 850000,
    pe: 68.5,
    marketCap: 312000000000
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Ltd',
    price: 9450.25,
    change: 2.1,
    volume: 450000,
    pe: 30.8,
    marketCap: 285000000000
  },
  {
    symbol: 'HCLTECH',
    name: 'HCL Technologies Ltd',
    price: 1120.40,
    change: -1.2,
    volume: 1850000,
    pe: 18.5,
    marketCap: 304000000000
  }
];

export default function PortfolioAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('1M');
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [portfolioData, setPortfolioData] = useState(PORTFOLIO_DATA);
  const [isAlpacaConnected, setIsAlpacaConnected] = useState(false);
  const [isZerodhaConnected, setIsZerodhaConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePortfolioData = async () => {
      try {
        // Check connection status
        const alpacaConnected = alpacaService.isAlpacaConnected();
        const zerodhaConnected = zerodhaService.isConnected();

        setIsAlpacaConnected(alpacaConnected);
        setIsZerodhaConnected(zerodhaConnected);

        let realPortfolioData = null;

        // Try to get real portfolio data from Alpaca
        if (alpacaConnected) {
          try {
            const account = await alpacaService.getAccount();
            const positions = await alpacaService.getPositions();
            const orders = await alpacaService.getOrders();

            if (account && positions) {
              realPortfolioData = await buildPortfolioFromAlpaca(account, positions, orders);
            }
          } catch (error) {
            console.error('Error fetching Alpaca portfolio:', error);
          }
        }

        // Try to get real portfolio data from Zerodha
        if (zerodhaConnected && !realPortfolioData) {
          try {
            const zerodhaPortfolio = await zerodhaService.getPortfolio();
            if (zerodhaPortfolio) {
              realPortfolioData = await buildPortfolioFromZerodha(zerodhaPortfolio);
            }
          } catch (error) {
            console.error('Error fetching Zerodha portfolio:', error);
          }
        }

        // Use real data if available, otherwise use mock data
        setPortfolioData(realPortfolioData || PORTFOLIO_DATA);
        setWatchlistData(WATCHLIST_DATA);

      } catch (error) {
        console.error('Error initializing portfolio:', error);
        setPortfolioData(PORTFOLIO_DATA);
        setWatchlistData(WATCHLIST_DATA);
      }

      setLoading(false);
    };

    initializePortfolioData();

    // Subscribe to updates
    const alpacaUnsubscribe = alpacaService.subscribe(async (data) => {
      setIsAlpacaConnected(data.connected);
      if (data.connected && data.portfolio) {
        const updatedData = await updatePortfolioFromAlpaca(data);
        if (updatedData) {
          setPortfolioData(updatedData);
        }
      }
    });

    const zerodhaUnsubscribe = zerodhaService.subscribe(async (data) => {
      setIsZerodhaConnected(data.connected);
      if (data.connected && data.portfolioSummary) {
        const updatedData = await updatePortfolioFromZerodha(data);
        if (updatedData) {
          setPortfolioData(updatedData);
        }
      }
    });

    // Refresh portfolio data every 5 minutes
    const refreshInterval = setInterval(() => {
      if (isAlpacaConnected || isZerodhaConnected) {
        initializePortfolioData();
      }
    }, 5 * 60 * 1000);

    return () => {
      alpacaUnsubscribe();
      zerodhaUnsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  // Helper function to build portfolio data from Alpaca
  const buildPortfolioFromAlpaca = async (account, positions, orders) => {
    try {
      const totalValue = parseFloat(account.portfolio_value || 0);
      const cash = parseFloat(account.cash || 0);
      const dayChange = parseFloat(account.day_change || 0);
      const dayChangePercent = parseFloat(account.day_change_percent || 0);

      // Calculate total return
      const totalReturn = totalValue - parseFloat(account.initial_value || totalValue);
      const totalReturnPercent = parseFloat(account.initial_value || totalValue) > 0 ?
        (totalReturn / parseFloat(account.initial_value || totalValue)) * 100 : 0;

      // Process holdings
      const holdings = await Promise.all(positions.map(async (pos) => {
        try {
          const quote = await alpacaService.getQuote(pos.symbol);
          const currentPrice = quote ? quote.price : parseFloat(pos.current_price || pos.avg_entry_price || 0);

          return {
            symbol: pos.symbol,
            name: pos.symbol, // You might want to fetch company names
            shares: parseFloat(pos.qty),
            avgPrice: parseFloat(pos.avg_entry_price || 0),
            currentPrice: currentPrice,
            value: parseFloat(pos.market_value || 0),
            dayChange: quote ? quote.changePercent : 0,
            totalReturn: parseFloat(pos.unrealized_plpc || 0) * 100,
            weight: totalValue > 0 ? (parseFloat(pos.market_value || 0) / totalValue) * 100 : 0,
            sector: 'Unknown' // You might want to fetch sector data
          };
        } catch (error) {
          console.error(`Error processing position ${pos.symbol}:`, error);
          return {
            symbol: pos.symbol,
            name: pos.symbol,
            shares: parseFloat(pos.qty),
            avgPrice: parseFloat(pos.avg_entry_price || 0),
            currentPrice: parseFloat(pos.current_price || pos.avg_entry_price || 0),
            value: parseFloat(pos.market_value || 0),
            dayChange: 0,
            totalReturn: parseFloat(pos.unrealized_plpc || 0) * 100,
            weight: totalValue > 0 ? (parseFloat(pos.market_value || 0) / totalValue) * 100 : 0,
            sector: 'Unknown'
          };
        }
      }));

      // Calculate sector allocation
      const sectorMap = {};
      holdings.forEach(holding => {
        if (!sectorMap[holding.sector]) {
          sectorMap[holding.sector] = { value: 0, change: 0, count: 0 };
        }
        sectorMap[holding.sector].value += holding.value;
        sectorMap[holding.sector].change += holding.dayChange;
        sectorMap[holding.sector].count += 1;
      });

      const sectors = Object.entries(sectorMap).map(([name, data]) => ({
        name,
        value: data.value,
        percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
        change: data.count > 0 ? data.change / data.count : 0
      }));

      // Add cash allocation
      if (cash > 0) {
        sectors.push({
          name: 'Cash',
          value: cash,
          percentage: totalValue > 0 ? (cash / totalValue) * 100 : 0,
          change: 0
        });
      }

      return {
        summary: {
          totalValue,
          dayChange,
          dayChangePercent,
          totalReturn,
          totalReturnPercent,
          cash
        },
        allocation: {
          sectors,
          marketCap: [
            { name: 'Large Cap', value: totalValue * 0.6, percentage: 60 },
            { name: 'Mid Cap', value: totalValue * 0.25, percentage: 25 },
            { name: 'Small Cap', value: totalValue * 0.15, percentage: 15 }
          ]
        },
        holdings,
        performance: generatePerformanceData(totalValue, dayChange),
        transactions: orders.slice(0, 10).map(order => ({
          id: order.id,
          date: order.created_at.split('T')[0],
          type: order.side === 'buy' ? 'Buy' : 'Sell',
          symbol: order.symbol,
          shares: parseFloat(order.qty),
          price: parseFloat(order.filled_avg_price || order.limit_price || 0),
          value: parseFloat(order.filled_qty || 0) * parseFloat(order.filled_avg_price || order.limit_price || 0),
          fees: 0 // Alpaca doesn't charge commission
        }))
      };
    } catch (error) {
      console.error('Error building Alpaca portfolio:', error);
      return null;
    }
  };

  // Helper function to build portfolio data from Zerodha
  const buildPortfolioFromZerodha = async (zerodhaData) => {
    try {
      // Process Zerodha portfolio data
      // This would depend on the structure of your Zerodha integration
      return {
        summary: {
          totalValue: zerodhaData.totalValue || 0,
          dayChange: zerodhaData.dayChange || 0,
          dayChangePercent: zerodhaData.dayChangePercent || 0,
          totalReturn: zerodhaData.totalReturn || 0,
          totalReturnPercent: zerodhaData.totalReturnPercent || 0,
          cash: zerodhaData.cash || 0
        },
        allocation: zerodhaData.allocation || PORTFOLIO_DATA.allocation,
        holdings: zerodhaData.holdings || [],
        performance: zerodhaData.performance || PORTFOLIO_DATA.performance,
        transactions: zerodhaData.transactions || []
      };
    } catch (error) {
      console.error('Error building Zerodha portfolio:', error);
      return null;
    }
  };

  // Generate performance data
  const generatePerformanceData = (totalValue, dayChange) => {
    const data = [];
    const baseValue = totalValue - dayChange;

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const randomChange = (Math.random() - 0.5) * 0.02; // ±1% random change
      const value = baseValue * (1 + randomChange * i / 30);

      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        change: i === 0 ? dayChange : (Math.random() - 0.5) * 10000
      });
    }

    return data;
  };

  const updatePortfolioFromAlpaca = async (alpacaData) => {
    // Update portfolio data with Alpaca information
    const updatedData = {
      ...portfolioData,
      summary: {
        ...portfolioData.summary,
        totalValue: alpacaData.portfolio.totalValue,
        dayChange: alpacaData.portfolio.dayChange,
        dayChangePercent: parseFloat(alpacaData.portfolio.dayChangePercent),
        cash: alpacaData.portfolio.cash
      },
      holdings: alpacaData.positions.map(pos => ({
        symbol: pos.symbol,
        name: pos.symbol,
        shares: parseFloat(pos.qty),
        avgPrice: parseFloat(pos.avg_entry_price || 0),
        currentPrice: parseFloat(pos.current_price || pos.avg_entry_price || 0),
        value: parseFloat(pos.market_value || 0),
        dayChange: 0, // Calculate from price data
        totalReturn: parseFloat(pos.unrealized_plpc || 0) * 100,
        weight: 0, // Calculate based on total portfolio
        sector: 'Unknown'
      }))
    };
    setPortfolioData(updatedData);
  };

  const updatePortfolioFromZerodha = (zerodhaData) => {
    // Update portfolio data with Zerodha information
    const updatedData = {
      ...portfolioData,
      summary: {
        ...portfolioData.summary,
        totalValue: parseFloat(zerodhaData.portfolioSummary.currentValue),
        totalReturn: parseFloat(zerodhaData.portfolioSummary.totalPnL),
        totalReturnPercent: parseFloat(zerodhaData.portfolioSummary.totalPnLPercentage)
      }
    };
    setPortfolioData(updatedData);
  };

  // Format currency
  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  // Handle holding selection
  const handleHoldingSelect = (holding) => {
    setSelectedHolding(holding);
  };

  // Render portfolio overview
  const renderPortfolioOverview = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Portfolio Value</h3>
            <div className="text-2xl font-bold mb-2">{formatCurrency(PORTFOLIO_DATA.summary.totalValue)}</div>
            <div className="flex items-center">
              <span className={`text-sm ${PORTFOLIO_DATA.summary.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {PORTFOLIO_DATA.summary.dayChange >= 0 ? '+' : ''}{formatCurrency(PORTFOLIO_DATA.summary.dayChange)} ({PORTFOLIO_DATA.summary.dayChangePercent >= 0 ? '+' : ''}{PORTFOLIO_DATA.summary.dayChangePercent}%)
              </span>
              <span className="text-xs text-gray-500 ml-2">Today</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Total Return:</div>
              <div className={`font-medium ${PORTFOLIO_DATA.summary.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {PORTFOLIO_DATA.summary.totalReturn >= 0 ? '+' : ''}{formatCurrency(PORTFOLIO_DATA.summary.totalReturn)} ({PORTFOLIO_DATA.summary.totalReturnPercent >= 0 ? '+' : ''}{PORTFOLIO_DATA.summary.totalReturnPercent}%)
              </div>
              <div className="text-gray-600">Cash Balance:</div>
              <div className="font-medium">{formatCurrency(PORTFOLIO_DATA.summary.cash)}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Sector Allocation</h3>
            <div className="space-y-2">
              {PORTFOLIO_DATA.allocation.sectors.map((sector, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>{sector.name}</span>
                    <span className="font-medium">{sector.percentage}%</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sector.name === 'Cash' ? 'bg-gray-400' :
                        index % 5 === 0 ? 'bg-blue-500' :
                        index % 5 === 1 ? 'bg-green-500' :
                        index % 5 === 2 ? 'bg-purple-500' :
                        index % 5 === 3 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${sector.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Risk Metrics</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="text-xs text-gray-500">Volatility (Annualized)</div>
                <div className="text-lg font-medium">{PORTFOLIO_DATA.riskMetrics.volatility}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Beta</div>
                <div className="text-lg font-medium">{PORTFOLIO_DATA.riskMetrics.beta}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Sharpe Ratio</div>
                <div className="text-lg font-medium">{PORTFOLIO_DATA.riskMetrics.sharpeRatio}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Max Drawdown</div>
                <div className="text-lg font-medium">{PORTFOLIO_DATA.riskMetrics.maxDrawdown}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Correlation to Nifty</div>
                <div className="text-lg font-medium">{PORTFOLIO_DATA.riskMetrics.correlationSP}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Value at Risk (Daily)</div>
                <div className="text-lg font-medium">{PORTFOLIO_DATA.riskMetrics.valueAtRisk}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Portfolio Performance</h3>
            <div className="flex space-x-1">
              {['1W', '1M', '3M', '6M', 'YTD', '1Y', 'All'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-2 py-1 text-xs rounded ${
                    timeframe === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Portfolio performance chart would be displayed here</p>
          </div>
          <div className="mt-3 flex justify-between text-sm">
            <div>
              <span className="text-gray-500">Starting Value:</span>
              <span className="ml-1 font-medium">{formatCurrency(1100000)}</span>
            </div>
            <div>
              <span className="text-gray-500">Ending Value:</span>
              <span className="ml-1 font-medium">{formatCurrency(PORTFOLIO_DATA.summary.totalValue)}</span>
            </div>
            <div>
              <span className="text-gray-500">Return:</span>
              <span className="ml-1 font-medium text-green-600">+13.6%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Holdings</h3>
            <button
              onClick={() => setShowAddTransaction(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day Change</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Return</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {PORTFOLIO_DATA.holdings.map((holding, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 cursor-pointer ${selectedHolding?.symbol === holding.symbol ? 'bg-blue-50' : ''}`}
                    onClick={() => handleHoldingSelect(holding)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                      <div className="text-xs text-gray-500">{holding.name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{holding.shares}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{holding.avgPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{holding.currentPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{formatCurrency(holding.value)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={holding.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {holding.dayChange >= 0 ? '+' : ''}{holding.dayChange}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={holding.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {holding.totalReturn >= 0 ? '+' : ''}{holding.totalReturn}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{holding.weight}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Buy</button>
                        <button className="text-red-600 hover:text-red-800">Sell</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render risk analysis
  const renderRiskAnalysis = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Risk Heatmap</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Risk heatmap would be displayed here</p>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              * Showing risk exposure by sector and market cap
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Correlation Matrix</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Correlation matrix would be displayed here</p>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              * Showing correlation between holdings
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Value at Risk (VaR)</h3>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Daily VaR (95% confidence)</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '3.2%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">3.2%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                There is a 95% chance that your portfolio will not lose more than 3.2% in a single day.
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Monthly VaR (95% confidence)</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '7.5%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">7.5%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                There is a 95% chance that your portfolio will not lose more than 7.5% in a month.
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Volatility</h3>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Portfolio Volatility</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '12.5%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">12.5%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Annualized standard deviation of portfolio returns.
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Benchmark Volatility (Nifty 50)</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '14.8%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">14.8%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Your portfolio is less volatile than the benchmark.
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Drawdown Analysis</h3>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Maximum Drawdown</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '8.5%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">8.5%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Largest peak-to-trough decline in portfolio value.
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Recovery Time</div>
              <div className="text-lg font-medium">35 days</div>
              <div className="text-xs text-gray-500 mt-1">
                Average time to recover from drawdowns.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-3">Stress Test Scenarios</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Most Affected Holdings</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Market Crash (2020 COVID-19)</div>
                    <div className="text-xs text-gray-500">Simulates March 2020 market conditions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-red-600 font-medium">-28.5%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(893750)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TATAMOTORS, INFY, HDFCBANK</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Interest Rate Hike (+1%)</div>
                    <div className="text-xs text-gray-500">Simulates sudden 1% increase in interest rates</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-red-600 font-medium">-5.2%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(1185000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HDFCBANK, RELIANCE</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Tech Sector Correction</div>
                    <div className="text-xs text-gray-500">Simulates 15% decline in technology stocks</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-red-600 font-medium">-7.8%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(1152500)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">INFY, TCS</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Currency Crisis (INR -10%)</div>
                    <div className="text-xs text-gray-500">Simulates 10% depreciation of Indian Rupee</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-green-600 font-medium">+3.5%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(1293750)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TCS, INFY (positive impact)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render transactions
  const renderTransactions = () => {
    return (
      <div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Recent Transactions</h3>
            <button
              onClick={() => setShowAddTransaction(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {PORTFOLIO_DATA.transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.shares}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{transaction.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{transaction.value.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{transaction.fees}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAddTransaction && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add Transaction</h3>
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio h-4 w-4 text-blue-600" name="transactionType" value="buy" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Buy</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio h-4 w-4 text-blue-600" name="transactionType" value="sell" />
                      <span className="ml-2 text-sm text-gray-700">Sell</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                  <input
                    type="text"
                    className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                    placeholder="e.g., RELIANCE"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                    <input
                      type="number"
                      className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                      placeholder="Number of shares"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Share</label>
                    <input
                      type="number"
                      className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                      placeholder="Price in ₹"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                      defaultValue="2023-06-21"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                    <input
                      type="number"
                      className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                      placeholder="Fees in ₹"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                    placeholder="Optional notes about this transaction"
                    rows="2"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Transaction Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Buy Transactions</div>
                <div className="text-lg font-medium">32</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Sell Transactions</div>
                <div className="text-lg font-medium">18</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Average Buy Price (RELIANCE)</div>
                <div className="text-lg font-medium">₹2,450.75</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Fees Paid</div>
                <div className="text-lg font-medium">₹3,250</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Transaction History</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Transaction history chart would be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render watchlist
  const renderWatchlist = () => {
    return (
      <div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">My Watchlist</h3>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Symbol
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/E</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {WATCHLIST_DATA.map((stock, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                      <div className="text-xs text-gray-500">{stock.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{stock.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(stock.volume / 1000000).toFixed(2)}M</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.pe}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(stock.marketCap / 10000000000).toFixed(2)}B</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-800">Buy</button>
                        <button className="text-blue-600 hover:text-blue-800">Alert</button>
                        <button className="text-red-600 hover:text-red-800">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Price Alerts</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="text-sm font-medium">ICICIBANK &gt; ₹950</div>
                  <div className="text-xs text-gray-500">Current: ₹945.30</div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="text-sm font-medium">BAJFINANCE &lt; ₹6500</div>
                  <div className="text-xs text-gray-500">Current: ₹6780.50</div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="text-sm font-medium">MARUTI &gt; ₹9500</div>
                  <div className="text-xs text-gray-500">Current: ₹9450.25</div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Alert
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Technical Signals</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <div>
                  <div className="text-sm font-medium">ICICIBANK</div>
                  <div className="text-xs text-gray-600">Golden Cross (50-day MA crossed above 200-day MA)</div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Bullish</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <div>
                  <div className="text-sm font-medium">MARUTI</div>
                  <div className="text-xs text-gray-600">RSI moved above 70 (Overbought)</div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Bullish</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div>
                  <div className="text-sm font-medium">HCLTECH</div>
                  <div className="text-xs text-gray-600">MACD crossed below signal line</div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Bearish</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div>
                  <div className="text-sm font-medium">BAJFINANCE</div>
                  <div className="text-xs text-gray-600">Price broke below 50-day moving average</div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Bearish</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <PageLayout title="📊 Portfolio Analytics" subtitle="Comprehensive portfolio analysis and insights">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner
            text="Loading portfolio data..."
            size="lg"
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="📊 Portfolio Analytics" subtitle="Comprehensive portfolio analysis and insights">
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Account Connections</h3>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isAlpacaConnected
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isAlpacaConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Alpaca {isAlpacaConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isZerodhaConnected
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isZerodhaConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Zerodha {isZerodhaConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">📈 Portfolio Analytics</h1>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                NSE
              </div>
              <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <span className="h-2 w-2 bg-purple-500 rounded-full mr-1.5"></span>
                Real-time
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
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
                  Portfolio Overview
                </button>
                <button
                  onClick={() => setActiveTab('risk')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'risk'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Risk Analysis
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'transactions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab('watchlist')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'watchlist'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Watchlist
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && renderPortfolioOverview()}
            {activeTab === 'risk' && renderRiskAnalysis()}
            {activeTab === 'transactions' && renderTransactions()}
            {activeTab === 'watchlist' && renderWatchlist()}
          </div>

          {/* Portfolio Analytics Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">About Portfolio Analytics</h2>
            <p className="text-gray-600 mb-4">
              Portfolio Analytics provides comprehensive tools to track, analyze, and optimize your investment portfolio.
              Monitor performance, assess risk, and make informed decisions based on real-time data and advanced analytics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <h3 className="ml-3 font-medium">Performance Tracking</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Track your portfolio's performance with real-time updates, historical comparisons, and benchmark analysis.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <h3 className="ml-3 font-medium">Risk Assessment</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Evaluate your portfolio's risk profile with advanced metrics like volatility, beta, and Value at Risk (VaR).
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <h3 className="ml-3 font-medium">Optimization Tools</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Optimize your portfolio with allocation recommendations, rebalancing alerts, and tax-efficient strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
