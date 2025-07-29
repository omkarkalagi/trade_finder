import React, { useState } from 'react';

const SectorAnalysis = () => {
  const [selectedSector, setSelectedSector] = useState('technology');

  const sectors = [
    { id: 'technology', name: 'Technology', icon: '💻', performance: '+12.5%', stocks: 45 },
    { id: 'finance', name: 'Finance', icon: '🏦', performance: '+8.2%', stocks: 32 },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', performance: '+15.3%', stocks: 28 },
    { id: 'energy', name: 'Energy', icon: '⚡', performance: '+5.7%', stocks: 18 },
    { id: 'consumer', name: 'Consumer', icon: '🛒', performance: '+9.1%', stocks: 25 },
    { id: 'industrial', name: 'Industrial', icon: '🏭', performance: '+6.8%', stocks: 22 }
  ];

  const topStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', change: '+2.5%', price: '₹2,456' },
    { symbol: 'TCS', name: 'Tata Consultancy', sector: 'Technology', change: '+1.8%', price: '₹3,456' },
    { symbol: 'HDFC', name: 'HDFC Bank', sector: 'Finance', change: '+3.2%', price: '₹1,654' },
    { symbol: 'INFY', name: 'Infosys', sector: 'Technology', change: '+1.2%', price: '₹1,456' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Sector Analysis</h2>
        <span className="text-2xl">🏢</span>
      </div>

      {/* Sector Performance Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedSector === sector.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedSector(sector.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{sector.icon}</span>
              <span className={`text-sm font-medium ${
                sector.performance.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {sector.performance}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{sector.name}</h3>
            <p className="text-sm text-gray-600">{sector.stocks} stocks</p>
          </div>
        ))}
      </div>

      {/* Top Stocks in Selected Sector */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Stocks in {sectors.find(s => s.id === selectedSector)?.name}
        </h3>
        <div className="space-y-3">
          {topStocks.map((stock, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">{stock.symbol}</p>
                  <p className="text-sm text-gray-600">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  stock.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change}
                </p>
                <p className="text-sm text-gray-600">{stock.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Sector Insights</h4>
        <p className="text-sm text-blue-800">
          {sectors.find(s => s.id === selectedSector)?.name} sector is showing strong momentum
          with {sectors.find(s => s.id === selectedSector)?.performance} performance this month.
          Consider diversifying your portfolio across multiple sectors for better risk management.
        </p>
      </div>
    </div>
  );
};

export default SectorAnalysis;
