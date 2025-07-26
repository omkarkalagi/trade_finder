import React, { useState } from 'react';

const TradingPanel = () => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [orderType, setOrderType] = useState('BUY');
  const [price, setPrice] = useState(0);

  const placeOrder = () => {
    // Order placement logic (to be implemented)
    alert(`Placing ${orderType} order for ${quantity} shares of ${symbol} at ${price}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Trading Panel</h2>
      <input
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={e => setSymbol(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
        className="w-full mb-2 p-2 border rounded"
      />
      <select
        value={orderType}
        onChange={e => setOrderType(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      >
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>
      <button
        onClick={placeOrder}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
      >
        Place Order
      </button>
    </div>
  );
};

export default TradingPanel; 