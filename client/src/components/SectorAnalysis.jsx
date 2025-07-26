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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SectorAnalysis = () => {
  const [sectorData, setSectorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    // Simulated API call to get sector data
    setTimeout(() => {
      const sectors = [
        { name: 'Technology', change: 2.5, volatility: 1.8 },
        { name: 'Healthcare', change: 1.2, volatility: 1.2 },
        { name: 'Finance', change: -0.8, volatility: 2.1 },
        { name: 'Energy', change: 3.1, volatility: 2.5 },
        { name: 'Consumer', change: 0.5, volatility: 1.1 },
      ];
      
      // AI prediction based on sector data
      const mostVolatile = sectors.reduce((max, sector) => 
        sector.volatility > max.volatility ? sector : max, sectors[0]);
      
      const mostGrowing = sectors.reduce((max, sector) => 
        sector.change > max.change ? sector : max, sectors[0]);
      
      setPrediction(
        `Based on current trends, ${mostGrowing.name} sector is showing the strongest growth potential, ` +
        `while ${mostVolatile.name} is the most volatile. Consider diversifying investments ` +
        `across these sectors for optimal returns.`
      );
      
      setSectorData(sectors);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sector Analysis</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: sectorData.map(s => s.name),
    datasets: [
      {
        label: 'Daily Change (%)',
        data: sectorData.map(s => s.change),
        backgroundColor: sectorData.map(s => s.change >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
        borderColor: sectorData.map(s => s.change >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'),
        borderWidth: 1,
      },
      {
        label: 'Volatility Index',
        data: sectorData.map(s => s.volatility),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sector Performance Analysis',
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <Bar data={chartData} options={options} />
      
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">AI Sector Prediction</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">{prediction}</p>
        </div>
      </div>
    </div>
  );
};

export default SectorAnalysis; 