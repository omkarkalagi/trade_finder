# Trade Finder - AI Stock Trading Platform

## Features
- Real-time stock market data via Alpaca and Zerodha APIs
- AI-powered stock recommendations
- OTP-based authentication
- Portfolio management and analysis
- Trading panel with order placement
- Payment integration with Stripe
- Professional dashboard with market insights
- Technical analysis tools

## Tech Stack
- Frontend: React.js + Tailwind CSS
- Backend: Express.js + MongoDB
- Deployment: Vercel (frontend) + Render (backend)

## Setup

### Backend
1. Create `.env` file in `server/` directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
STRIPE_SECRET_KEY=your_stripe_secret
ZERODHA_API_KEY=your_zerodha_key
ZERODHA_API_SECRET=your_zerodha_secret
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
ALPACA_API_KEY=your_alpaca_key
ALPACA_API_SECRET=your_alpaca_secret
ALPACA_API_BASE_URL=https://broker-api.sandbox.alpaca.markets
ALPACA_WS_URL=wss://broker-api.sandbox.alpaca.markets/stream
NODE_ENV=development
```

2. Install dependencies:
```bash
cd server
npm install
```

3. Start server:
```bash
npm start
```

### Frontend
1. Create `.env` file in `client/` directory with:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_ALPACA_API_KEY=your_alpaca_key
VITE_ALPACA_API_SECRET=your_alpaca_secret
VITE_NEWS_API_KEY=your_news_api_key
```

2. Install dependencies:
```bash
cd client
npm install
```

3. Start development server:
```bash
npm run dev
```

## Deployment
- Frontend: Deploy to Vercel
- Backend: Deploy to Render
