const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  historicalData: [{
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stock', stockSchema); 