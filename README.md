# Trade Finder - AI Stock Trading Platform

## Features
- Real-time Indian stock market data via Zerodha Kite API
- AI-powered stock recommendations
- Email/password and OTP-based authentication
- Portfolio management
- Trading panel with order placement
- Payment integration with Stripe
- Professional dashboard with market insights

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
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
STRIPE_SECRET_KEY=your_stripe_secret
ZERODHA_API_KEY=your_zerodha_key
ZERODHA_API_SECRET=your_zerodha_secret
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
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
1. Install dependencies:
```bash
cd client
npm install
```

2. Start development server:
```bash
npm start
```

## Deployment
- Frontend: Deploy to Vercel
- Backend: Deploy to Render 
