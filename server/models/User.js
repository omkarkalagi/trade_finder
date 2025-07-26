const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'User' },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, select: false },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

module.exports = mongoose.model('User', userSchema); 