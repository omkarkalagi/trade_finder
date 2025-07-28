const tf = require('@tensorflow/tfjs-node');
const { TechnicalAnalysis } = require('./technical');
const { executeTrade } = require('./tradeExecutor');

class TradingBot {
  constructor(strategy, symbol) {
    this.strategy = strategy;
    this.symbol = symbol;
    this.model = null;
    this.technical = new TechnicalAnalysis();
    this.loadModel();
  }

  async loadModel() {
    try {
      this.model = await tf.loadLayersModel(
        `file://./models/${this.strategy}/model.json`
      );
      console.log(`Loaded ${this.strategy} model for ${this.symbol}`);
    } catch (e) {
      console.error(`Error loading model: ${e.message}`);
      this.model = null;
    }
  }

  async analyze(data) {
    if (!this.model) return null;

    const features = this.technical.extractFeatures(data);
    const tensor = tf.tensor2d([features]);
    const prediction = this.model.predict(tensor);
    const [confidence] = await prediction.data();

    return {
      signal: confidence > 0.7 ? 'BUY' : confidence < 0.3 ? 'SELL' : 'HOLD',
      confidence,
      strategy: this.strategy,
      timestamp: Date.now()
    };
  }

  async executeDecision(data) {
    const analysis = await this.analyze(data);
    if (analysis && analysis.signal !== 'HOLD') {
      executeTrade(this.symbol, analysis.signal, analysis.confidence);
      return analysis;
    }
    return null;
  }
}

// Bot Manager
class BotManager {
  constructor() {
    this.bots = new Map();
  }

  createBot(strategy, symbol) {
    const key = `${strategy}-${symbol}`;
    if (!this.bots.has(key)) {
      this.bots.set(key, new TradingBot(strategy, symbol));
    }
    return this.bots.get(key);
  }

  getBot(strategy, symbol) {
    return this.bots.get(`${strategy}-${symbol}`) ||
           this.createBot(strategy, symbol);
  }
}

module.exports = new BotManager();
