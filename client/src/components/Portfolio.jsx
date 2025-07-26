import React from 'react';

const Portfolio = ({ data }) => (
  <div className="bg-white rounded-xl shadow-md p-4">
    <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
    <div className="space-y-2">
      {data && data.length > 0 ? data.map((item, idx) => (
        <div key={idx} className="flex justify-between text-sm">
          <span>{item.symbol}</span>
          <span>{item.quantity} @ {item.averagePrice}</span>
        </div>
      )) : <div className="text-gray-400">No holdings</div>}
    </div>
  </div>
);

export default Portfolio; 