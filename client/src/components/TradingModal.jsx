import React, { useState, useEffect } from 'react';
import tradingService from '../services/tradingService';

export default function TradingModal({ isOpen, onClose, symbol, side, currentPrice }) {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState(currentPrice || 0);
  const [stopPrice, setStopPrice] = useState(currentPrice || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentPrice) {
      setLimitPrice(currentPrice);
      setStopPrice(currentPrice * 0.95); // 5% below current price for stop loss
    }
  }, [currentPrice]);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const orderData = {
        symbol,
        side,
        quantity: parseInt(quantity),
        orderType,
        limitPrice: orderType === 'limit' ? parseFloat(limitPrice) : undefined,
        stopPrice: orderType === 'stop' ? parseFloat(stopPrice) : undefined
      };

      const result = await tradingService.placeOrder(orderData);

      if (result.success) {
        setSuccess(`${side.toUpperCase()} order placed successfully! Order ID: ${result.orderId}`);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while placing the order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const price = orderType === 'limit' ? limitPrice : currentPrice;
    return (quantity * price).toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {side === 'buy' ? '🟢 Buy' : '🔴 Sell'} {symbol.replace('.NS', '')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Price */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Price:</span>
            <span className="font-semibold">₹{currentPrice?.toFixed(2) || 'N/A'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Type
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="market">Market Order</option>
              <option value="limit">Limit Order</option>
              <option value="stop">Stop Order</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Limit Price (for limit orders) */}
          {orderType === 'limit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limit Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Stop Price (for stop orders) */}
          {orderType === 'stop' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stop Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Type:</span>
                <span className="font-medium capitalize">{orderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">{quantity} shares</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-medium">
                  ₹{orderType === 'limit' ? parseFloat(limitPrice).toFixed(2) : currentPrice?.toFixed(2) || 'Market'}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Estimated Total:</span>
                <span className="font-bold">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                side === 'buy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Placing Order...
                </div>
              ) : (
                `${side === 'buy' ? 'Buy' : 'Sell'} ${symbol.replace('.NS', '')}`
              )}
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Disclaimer:</strong> This is a demo trading interface. No real trades will be executed.
            All orders are simulated for educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
