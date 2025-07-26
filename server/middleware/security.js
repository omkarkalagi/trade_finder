const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean'); // Add XSS protection

module.exports = (app) => {
  app.use(helmet());
  app.use(rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100
  }));
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(xss()); // Add XSS middleware
};

// Enhanced security headers
exports.securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*.googleapis.com"],
      connectSrc: ["'self'", "https://api.zerodha.com", "https://newsapi.org"]
    }
  },
  referrerPolicy: { policy: 'same-origin' }
});

// Rate limiting
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Data sanitization
exports.sanitizeData = [
  mongoSanitize(), // Against NoSQL injection
  xss(), // Against XSS attacks
  hpp() // Against HTTP Parameter Pollution
];

// Session security
exports.sessionSecurity = (req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
}; 