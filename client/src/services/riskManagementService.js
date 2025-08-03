import notificationService from './notificationService';

class RiskManagementService {
  constructor() {
    this.riskSettings = {
      maxDailyLoss: 50000, // ₹50,000 max daily loss
      maxPositionSize: 100000, // ₹1,00,000 max position size
      maxPortfolioRisk: 0.02, // 2% max portfolio risk per trade
      stopLossPercentage: 0.05, // 5% stop loss
      takeProfitPercentage: 0.10, // 10% take profit
      maxOpenPositions: 10, // Maximum 10 open positions
      maxLeverage: 2, // Maximum 2x leverage
      riskRewardRatio: 2, // Minimum 1:2 risk-reward ratio
      maxSectorExposure: 0.25, // 25% max exposure to any sector
      maxSingleStockExposure: 0.10, // 10% max exposure to single stock
      emergencyStopEnabled: true,
      autoStopLossEnabled: true,
      positionSizingEnabled: true
    };

    this.dailyStats = {
      pnl: 0,
      trades: 0,
      wins: 0,
      losses: 0,
      maxDrawdown: 0,
      currentDrawdown: 0,
      lastResetDate: new Date().toDateString()
    };

    this.alerts = [];
    this.blockedActions = new Set();
    
    // Load settings from localStorage
    this.loadSettings();
    
    // Reset daily stats if new day
    this.checkDailyReset();
  }

  // Load risk settings from localStorage
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem('riskManagementSettings');
      if (savedSettings) {
        this.riskSettings = { ...this.riskSettings, ...JSON.parse(savedSettings) };
      }

      const savedStats = localStorage.getItem('dailyTradingStats');
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        if (stats.lastResetDate === new Date().toDateString()) {
          this.dailyStats = stats;
        }
      }
    } catch (error) {
      console.error('Error loading risk settings:', error);
    }
  }

  // Save settings to localStorage
  saveSettings() {
    try {
      localStorage.setItem('riskManagementSettings', JSON.stringify(this.riskSettings));
      localStorage.setItem('dailyTradingStats', JSON.stringify(this.dailyStats));
    } catch (error) {
      console.error('Error saving risk settings:', error);
    }
  }

  // Check if daily stats need to be reset
  checkDailyReset() {
    const today = new Date().toDateString();
    if (this.dailyStats.lastResetDate !== today) {
      this.dailyStats = {
        pnl: 0,
        trades: 0,
        wins: 0,
        losses: 0,
        maxDrawdown: 0,
        currentDrawdown: 0,
        lastResetDate: today
      };
      this.saveSettings();
    }
  }

  // Update risk settings
  updateSettings(newSettings) {
    this.riskSettings = { ...this.riskSettings, ...newSettings };
    this.saveSettings();
    
    notificationService.notifySystem('Risk management settings updated', 'success');
    
    // Re-evaluate all positions with new settings
    this.evaluateAllPositions();
  }

  // Validate trade before execution
  validateTrade(trade) {
    const validationResult = {
      allowed: true,
      warnings: [],
      errors: [],
      adjustedQuantity: trade.quantity,
      suggestedStopLoss: null,
      suggestedTakeProfit: null
    };

    // Check daily loss limit
    if (this.dailyStats.pnl <= -this.riskSettings.maxDailyLoss) {
      validationResult.allowed = false;
      validationResult.errors.push(`Daily loss limit of ₹${this.riskSettings.maxDailyLoss.toLocaleString()} exceeded`);
    }

    // Check position size limit
    const positionValue = trade.price * trade.quantity;
    if (positionValue > this.riskSettings.maxPositionSize) {
      const maxQuantity = Math.floor(this.riskSettings.maxPositionSize / trade.price);
      validationResult.warnings.push(`Position size reduced from ${trade.quantity} to ${maxQuantity} shares`);
      validationResult.adjustedQuantity = maxQuantity;
    }

    // Calculate suggested stop loss and take profit
    if (trade.side === 'buy') {
      validationResult.suggestedStopLoss = trade.price * (1 - this.riskSettings.stopLossPercentage);
      validationResult.suggestedTakeProfit = trade.price * (1 + this.riskSettings.takeProfitPercentage);
    } else {
      validationResult.suggestedStopLoss = trade.price * (1 + this.riskSettings.stopLossPercentage);
      validationResult.suggestedTakeProfit = trade.price * (1 - this.riskSettings.takeProfitPercentage);
    }

    // Check risk-reward ratio
    const riskAmount = Math.abs(trade.price - validationResult.suggestedStopLoss);
    const rewardAmount = Math.abs(validationResult.suggestedTakeProfit - trade.price);
    const riskRewardRatio = rewardAmount / riskAmount;
    
    if (riskRewardRatio < this.riskSettings.riskRewardRatio) {
      validationResult.warnings.push(`Risk-reward ratio ${riskRewardRatio.toFixed(2)} is below minimum ${this.riskSettings.riskRewardRatio}`);
    }

    // Emergency stop check
    if (this.riskSettings.emergencyStopEnabled && this.dailyStats.currentDrawdown > this.riskSettings.maxDailyLoss * 0.8) {
      validationResult.allowed = false;
      validationResult.errors.push('Emergency stop activated due to high drawdown');
    }

    return validationResult;
  }

  // Monitor position and apply automatic risk management
  monitorPosition(position) {
    const currentPrice = position.currentPrice;
    const entryPrice = position.entryPrice;
    const quantity = position.quantity;
    const side = position.side;

    let pnl = 0;
    if (side === 'buy') {
      pnl = (currentPrice - entryPrice) * quantity;
    } else {
      pnl = (entryPrice - currentPrice) * quantity;
    }

    // Check stop loss
    if (this.riskSettings.autoStopLossEnabled) {
      let stopLossTriggered = false;
      
      if (side === 'buy' && currentPrice <= entryPrice * (1 - this.riskSettings.stopLossPercentage)) {
        stopLossTriggered = true;
      } else if (side === 'sell' && currentPrice >= entryPrice * (1 + this.riskSettings.stopLossPercentage)) {
        stopLossTriggered = true;
      }

      if (stopLossTriggered) {
        this.triggerStopLoss(position);
        return { action: 'stop_loss', pnl };
      }
    }

    // Check take profit
    let takeProfitTriggered = false;
    
    if (side === 'buy' && currentPrice >= entryPrice * (1 + this.riskSettings.takeProfitPercentage)) {
      takeProfitTriggered = true;
    } else if (side === 'sell' && currentPrice <= entryPrice * (1 - this.riskSettings.takeProfitPercentage)) {
      takeProfitTriggered = true;
    }

    if (takeProfitTriggered) {
      this.triggerTakeProfit(position);
      return { action: 'take_profit', pnl };
    }

    return { action: 'monitor', pnl };
  }

  // Trigger stop loss
  triggerStopLoss(position) {
    notificationService.notifyTrade(
      `🛑 STOP LOSS: ${position.symbol} at ₹${position.currentPrice.toFixed(2)}`,
      'error'
    );
    
    // Add to alerts
    this.alerts.unshift({
      id: Date.now(),
      type: 'stop_loss',
      message: `Stop loss triggered for ${position.symbol}`,
      timestamp: new Date(),
      severity: 'high'
    });

    // Execute stop loss order (would integrate with broker API)
    this.executeStopLoss(position);
  }

  // Trigger take profit
  triggerTakeProfit(position) {
    notificationService.notifyTrade(
      `🎯 TAKE PROFIT: ${position.symbol} at ₹${position.currentPrice.toFixed(2)}`,
      'success'
    );
    
    // Add to alerts
    this.alerts.unshift({
      id: Date.now(),
      type: 'take_profit',
      message: `Take profit triggered for ${position.symbol}`,
      timestamp: new Date(),
      severity: 'low'
    });

    // Execute take profit order
    this.executeTakeProfit(position);
  }

  // Execute stop loss order
  executeStopLoss(position) {
    // This would integrate with the actual broker API
    console.log(`Executing stop loss for ${position.symbol}`);
    
    // Update daily stats
    this.updateDailyStats({
      pnl: position.unrealizedPnl,
      isWin: false
    });
  }

  // Execute take profit order
  executeTakeProfit(position) {
    // This would integrate with the actual broker API
    console.log(`Executing take profit for ${position.symbol}`);
    
    // Update daily stats
    this.updateDailyStats({
      pnl: position.unrealizedPnl,
      isWin: true
    });
  }

  // Update daily trading statistics
  updateDailyStats(trade) {
    this.dailyStats.trades++;
    this.dailyStats.pnl += trade.pnl;
    
    if (trade.isWin) {
      this.dailyStats.wins++;
    } else {
      this.dailyStats.losses++;
    }

    // Update drawdown
    if (this.dailyStats.pnl < 0) {
      this.dailyStats.currentDrawdown = Math.abs(this.dailyStats.pnl);
      this.dailyStats.maxDrawdown = Math.max(this.dailyStats.maxDrawdown, this.dailyStats.currentDrawdown);
    } else {
      this.dailyStats.currentDrawdown = 0;
    }

    this.saveSettings();

    // Check if daily loss limit is approaching
    if (this.dailyStats.pnl <= -this.riskSettings.maxDailyLoss * 0.8) {
      notificationService.notifySystem(
        '⚠️ WARNING: Approaching daily loss limit!',
        'warning'
      );
    }
  }

  // Get current risk metrics
  getRiskMetrics() {
    const winRate = this.dailyStats.trades > 0 ? (this.dailyStats.wins / this.dailyStats.trades) * 100 : 0;
    const avgTrade = this.dailyStats.trades > 0 ? this.dailyStats.pnl / this.dailyStats.trades : 0;
    
    return {
      dailyPnl: this.dailyStats.pnl,
      dailyTrades: this.dailyStats.trades,
      winRate: winRate.toFixed(1),
      avgTrade: avgTrade.toFixed(2),
      maxDrawdown: this.dailyStats.maxDrawdown,
      currentDrawdown: this.dailyStats.currentDrawdown,
      remainingDailyLoss: Math.max(0, this.riskSettings.maxDailyLoss + this.dailyStats.pnl),
      riskLevel: this.calculateRiskLevel()
    };
  }

  // Calculate current risk level
  calculateRiskLevel() {
    const lossPercentage = Math.abs(this.dailyStats.pnl) / this.riskSettings.maxDailyLoss;
    
    if (lossPercentage < 0.3) return 'Low';
    if (lossPercentage < 0.6) return 'Medium';
    if (lossPercentage < 0.8) return 'High';
    return 'Critical';
  }

  // Get recent alerts
  getAlerts(limit = 10) {
    return this.alerts.slice(0, limit);
  }

  // Clear alerts
  clearAlerts() {
    this.alerts = [];
  }

  // Emergency stop all trading
  emergencyStop() {
    this.blockedActions.add('all_trading');
    notificationService.notifySystem('🚨 EMERGENCY STOP ACTIVATED - All trading halted', 'error');
    
    // This would close all positions and cancel all orders
    console.log('Emergency stop activated - closing all positions');
  }

  // Resume trading after emergency stop
  resumeTrading() {
    this.blockedActions.clear();
    notificationService.notifySystem('✅ Trading resumed', 'success');
  }

  // Check if action is blocked
  isActionBlocked(action) {
    return this.blockedActions.has('all_trading') || this.blockedActions.has(action);
  }

  // Evaluate all positions (called when settings change)
  evaluateAllPositions() {
    // This would get all current positions and re-evaluate them
    console.log('Re-evaluating all positions with new risk settings');
  }
}

const riskManagementService = new RiskManagementService();
export default riskManagementService;
