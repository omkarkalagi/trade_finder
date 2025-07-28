import React from 'react';
import LiveMarket from './LiveMarket';
import BotPerformance from './BotPerformance';
import PortfolioSummary from './PortfolioSummary';
import TradingPanel from './TradingPanel';
import MarketNews from './MarketNews';
import RiskMonitor from './RiskMonitor';

const Dashboard = () => {
  return (
    <div className="p-6">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1 className="text-3xl font-bold mb-6">🚀 AI Trading Dashboard</h1>
        </Grid>

        {/* Real-time Market */}
        <Grid item xs={12} lg={8}>
          <LiveMarket />
        </Grid>

        {/* Portfolio Summary */}
        <Grid item xs={12} lg={4}>
          <PortfolioSummary />
        </Grid>

        {/* Bot Performance */}
        <Grid item xs={12}>
          <BotPerformance />
        </Grid>

        {/* Trading Panel */}
        <Grid item xs={12} md={6}>
          <TradingPanel />
        </Grid>

        {/* Risk Monitor */}
        <Grid item xs={12} md={6}>
          <RiskMonitor />
        </Grid>

        {/* Market News */}
        <Grid item xs={12}>
          <MarketNews />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
