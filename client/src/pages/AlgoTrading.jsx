import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { generateTradingStrategies } from '../services/algoService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AlgoTrading = () => {
  const [budget, setBudget] = useState(100000);
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Auto-trading states
  const [autoTradeAmount, setAutoTradeAmount] = useState(100000);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [autoTrades, setAutoTrades] = useState([]);
  const [expectedProfit, setExpectedProfit] = useState(0);
  const [expectedTime, setExpectedTime] = useState(0); // in hours
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [currentProfit, setCurrentProfit] = useState(0);
  const [paymentId, setPaymentId] = useState('');
  const [tradeHistory, setTradeHistory] = useState([]);

  const generateStrategies = () => {
    setLoading(true);
    
    // Simulate AI strategy generation
    setTimeout(() => {
      const newStrategies = [
        {
          id: 1,
          stock: 'RELIANCE',
          buyPrice: 2435.50,
          sellPrice: 2550.00,
          quantity: Math.floor(budget * 0.3 / 2435.50),
          holdingPeriod: '1-3 days',
          confidence: 88,
          rationale: 'Breakout from consolidation pattern with high volume'
        },
        {
          id: 2,
          stock: 'HDFCBANK',
          buyPrice: 1630.25,
          sellPrice: 1700.00,
          quantity: Math.floor(budget * 0.25 / 1630.25),
          holdingPeriod: '2-5 days',
          confidence: 82,
          rationale: 'Oversold RSI with institutional buying'
        },
        {
          id: 3,
          stock: 'INFY',
          buyPrice: 1405.75,
          sellPrice: 1480.00,
          quantity: Math.floor(budget * 0.2 / 1405.75),
          holdingPeriod: '3-7 days',
          confidence: 79,
          rationale: 'Bullish divergence on MACD indicator'
        },
        {
          id: 4,
          stock: 'BAJFINANCE',
          buyPrice: 7200.00,
          sellPrice: 7500.00,
          quantity: Math.floor(budget * 0.15 / 7200.00),
          holdingPeriod: '1-2 weeks',
          confidence: 85,
          rationale: 'Strong earnings growth potential'
        },
        {
          id: 5,
          stock: 'TATAMOTORS',
          buyPrice: 850.50,
          sellPrice: 900.00,
          quantity: Math.floor(budget * 0.1 / 850.50),
          holdingPeriod: '3-5 days',
          confidence: 76,
          rationale: 'Sector rotation into automotive stocks'
        }
      ];
      
      setStrategies(newStrategies);
      setLoading(false);
    }, 1500);
  };

  // Calculate potential profits
  const calculateProfit = (strategy) => {
    const investment = strategy.buyPrice * strategy.quantity;
    const returns = strategy.sellPrice * strategy.quantity;
    return {
      investment,
      returns,
      profit: returns - investment,
      roi: ((returns - investment) / investment * 100).toFixed(2)
    };
  };

  // Prepare data for chart
  const chartData = {
    labels: strategies.map(s => s.stock),
    datasets: [
      {
        label: 'Potential ROI (%)',
        data: strategies.map(s => parseFloat(calculateProfit(s).roi)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  // Simulate payment processing and auto-trade execution
  const handleAutoTradePayment = async () => {
    setIsPaymentProcessing(true);
    
    try {
      // In real app, this would call your payment API
      const paymentResponse = await axios.post('/api/payments/create', {
        amount: autoTradeAmount,
        currency: 'INR'
      });
      
      setPaymentId(paymentResponse.data.id);
      
      // Simulate payment confirmation
      setTimeout(async () => {
        setIsPaymentProcessing(false);
        setPaymentSuccess(true);
        
        // Execute auto-trades
        const executionResponse = await axios.post('/api/auto-trading/execute', {
          amount: autoTradeAmount,
          paymentId: paymentResponse.data.id
        });
        
        setAutoTrades(executionResponse.data.trades);
        setExpectedProfit(executionResponse.data.expectedProfit);
        setExpectedTime(executionResponse.data.expectedTimeHours);
        setTimeLeft(executionResponse.data.expectedTimeHours * 3600);
        setTradeHistory(executionResponse.data.tradeHistory);
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
      setIsPaymentProcessing(false);
    }
  };

  // Countdown timer and profit simulation
  useEffect(() => {
    let timer;
    if (paymentSuccess && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        
        // Simulate profit growth (linear for demo)
        const progress = 1 - (timeLeft / (expectedTime * 3600));
        setCurrentProfit(Math.floor(expectedProfit * progress));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentSuccess, timeLeft, expectedProfit, expectedTime]);

  // Format time for display
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Algorithmic Trading</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Investment Parameters</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Investment Budget (₹)</label>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center mt-2 text-lg font-semibold">
              ₹{budget.toLocaleString()}
            </div>
          </div>
          <button
            onClick={generateStrategies}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Generating Strategies...' : 'Generate Strategies'}
          </button>
        </div>
      </div>
      
      {strategies.length > 0 && (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Strategy Performance</h2>
            <div className="h-80">
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Potential Return on Investment' }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map(strategy => {
              const profitData = calculateProfit(strategy);
              
              return (
                <div key={strategy.id} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{strategy.stock}</h3>
                      <div className="text-sm text-gray-500">
                        Confidence: <span className="font-semibold">{strategy.confidence}%</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Hold: {strategy.holdingPeriod}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500 text-sm">Buy At</div>
                      <div className="font-bold">₹{strategy.buyPrice.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500 text-sm">Sell At</div>
                      <div className="font-bold">₹{strategy.sellPrice.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500 text-sm">Quantity</div>
                      <div className="font-bold">{strategy.quantity}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500 text-sm">ROI</div>
                      <div className="font-bold text-green-600">{profitData.roi}%</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Investment:</span>
                      <span>₹{profitData.investment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Expected Returns:</span>
                      <span>₹{profitData.returns.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2">
                      <span>Potential Profit:</span>
                      <span className="text-green-600">₹{profitData.profit.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-3">
                    <span className="font-medium">Rationale:</span> {strategy.rationale}
                  </div>
                  
                  <button className="w-full mt-4 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200">
                    Execute This Strategy
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {/* Auto Trading Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Auto Trading</h2>
        
        {!paymentSuccess ? (
          <>
            <p className="mb-4">
              Enter the amount you want to invest in auto-trading. Our AI will automatically execute 
              trades and manage your portfolio to maximize returns.
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">Investment Amount (₹)</label>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={autoTradeAmount}
                  onChange={(e) => setAutoTradeAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2 text-lg font-semibold">
                  ₹{autoTradeAmount.toLocaleString()}
                </div>
              </div>
              
              <button
                onClick={handleAutoTradePayment}
                disabled={isPaymentProcessing}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {isPaymentProcessing ? 'Processing...' : 'Start Auto Trading'}
              </button>
            </div>
            
            {isPaymentProcessing && (
              <div className="mt-6 text-center">
                <div className="mb-4">Scan QR Code to Pay</div>
                <QRCodeSVG 
                  value={`upi://pay?pa=kalagigroup@upi&pn=Kalagi%20Group&am=${autoTradeAmount}&tn=AutoTrading`}
                  size={256}
                  className="mx-auto border p-2 rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-500">
                  Pay ₹{autoTradeAmount.toLocaleString()} to start auto trading
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-2">Auto Trading Activated!</h3>
              <p>
                Your investment of ₹{autoTradeAmount.toLocaleString()} is being managed by our AI. 
                Expected profit: ₹{expectedProfit.toLocaleString()} in {expectedTime} hours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Profit Progress</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    ₹{currentProfit.toLocaleString()}
                  </div>
                  <div className="text-gray-600">
                    of ₹{expectedProfit.toLocaleString()} expected
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span>Time remaining:</span>
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${((expectedTime * 3600 - timeLeft) / (expectedTime * 3600)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Current Portfolio</h3>
                <div className="space-y-2">
                  {autoTrades.map((trade, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium">{trade.stock}</span>
                      <span>{trade.quantity} shares</span>
                      <span className={`${trade.action === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">Trade History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Stock</th>
                      <th className="px-4 py-2 text-left">Action</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tradeHistory.map((trade, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">{trade.time}</td>
                        <td className="px-4 py-2 font-medium">{trade.stock}</td>
                        <td className={`px-4 py-2 font-semibold ${
                          trade.action === 'BUY' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.action}
                        </td>
                        <td className="px-4 py-2 text-right">₹{trade.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">{trade.quantity}</td>
                        <td className="px-4 py-2 text-right">₹{(trade.price * trade.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => {
                  setPaymentSuccess(false);
                  setAutoTrades([]);
                  setTradeHistory([]);
                }}
              >
                Stop Auto Trading
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgoTrading; 