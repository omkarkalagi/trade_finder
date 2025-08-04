# Trade Finder - AI-Powered Stock Trading Platform 🚀

A comprehensive, modern trading platform built with React.js and Node.js, featuring real-time market data, AI-powered insights, and automated trading capabilities.

## ✨ Features

### 🎯 Core Trading Features
- **Real-time Market Data** - Live stock quotes, indices, and market indicators
- **AI-Powered Insights** - Smart trading recommendations and sentiment analysis
- **Portfolio Management** - Comprehensive portfolio tracking and analytics
- **Advanced Charting** - Interactive charts with technical indicators
- **Risk Management** - Automated risk assessment and portfolio protection
- **Order Management** - Buy/sell orders with advanced order types

### 🔥 Advanced Features
- **Algorithmic Trading** - Build and deploy custom trading strategies
- **Social Trading** - Follow and copy successful traders
- **Alternative Data** - Integrate news sentiment, social media, and economic indicators
- **Sector Analysis** - Deep dive into sector performance and trends
- **Strategy Builder** - Visual strategy creation with backtesting
- **Community Education** - Learning resources and trading community

### 📱 User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Beautiful UI** - Modern, intuitive interface with smooth animations
- **Real-time Updates** - Live data streaming and instant notifications
- **Dark/Light Theme** - Customizable theme preferences
- **Accessibility** - Full keyboard navigation and screen reader support

### 🔐 Security & Authentication
- **OTP-based Authentication** - Secure login with SMS verification
- **JWT Tokens** - Secure API authentication
- **Rate Limiting** - API protection against abuse
- **Error Handling** - Comprehensive error boundaries and graceful degradation

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Beautiful and responsive charts
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **Alpaca API** - Stock market data and trading
- **Twilio** - SMS/OTP services

### DevOps & Deployment
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality
- **Docker** - Containerization
- **Vercel** - Frontend deployment
- **Render** - Backend deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/trade-finder.git
cd trade-finder
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Set up environment variables**

**Client (.env in client/ directory):**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ALPACA_API_KEY=your_alpaca_api_key
VITE_ALPACA_API_SECRET=your_alpaca_api_secret
VITE_NEWS_API_KEY=your_news_api_key
```

**Server (.env in server/ directory):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/trade-finder
JWT_SECRET=your_super_secret_jwt_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_API_SECRET=your_alpaca_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. **Start the development servers**

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Project Structure

```
trade-finder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   │   ├── authRoutes.js   # Authentication endpoints
│   │   ├── marketRoutes.js # Market data endpoints
│   │   └── tradeRoutes.js  # Trading endpoints
│   ├── models/             # Database models
│   ├── middleware/         # Express middleware
│   ├── controllers/        # Route controllers
│   ├── services/           # Business logic
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/logout` - User logout

### Market Data
- `GET /api/market/overview` - Market overview
- `GET /api/market/quote/:symbol` - Stock quote
- `GET /api/market/status` - Market status
- `GET /api/market/news` - Market news
- `GET /api/market/sectors` - Sector performance
- `GET /api/market/trending` - Trending stocks
- `GET /api/market/search` - Stock search
- `GET /api/market/history/:symbol` - Historical data

### Trading
- `POST /api/trade/order` - Place order
- `GET /api/trade/orders` - Get orders
- `DELETE /api/trade/order/:id` - Cancel order
- `GET /api/trade/positions` - Get positions
- `GET /api/trade/portfolio` - Portfolio data

## 🎨 UI Components

### Dashboard Components
- **Dashboard** - Main overview with portfolio summary
- **LiveMarket** - Real-time market data display
- **PortfolioSummary** - Portfolio performance metrics
- **MarketNews** - Latest market news feed
- **MarketStatus** - Market open/close status

### Trading Components
- **TradingPanel** - Order placement interface
- **StrategyBuilder** - Visual strategy creation
- **RiskManagement** - Risk assessment tools
- **PortfolioAnalytics** - Advanced portfolio analysis

### Navigation
- **Sidebar** - Main navigation with beautiful gradients
- **MobileNav** - Mobile-optimized navigation
- **Breadcrumbs** - Page navigation context

## 🔍 Key Features Implemented

### ✅ Enhanced Dashboard
- Modern, responsive design with gradient backgrounds
- Real-time data integration
- Comprehensive portfolio overview
- Quick action buttons
- AI trading insights panel

### ✅ Beautiful Navigation
- Gradient sidebar with smooth animations
- Mobile-responsive design
- Active route highlighting
- User profile section
- Market status indicator

### ✅ Comprehensive Pages
- **Portfolio Analytics** - Complete portfolio management
- **Market Overview** - Multi-tab market data view
- **Trading Interface** - Order placement and management
- **Strategy Builder** - Algorithm creation tools

### ✅ Real-time Data Integration
- Live market data feeds
- WebSocket connections for real-time updates
- Comprehensive API endpoints
- Error handling and fallbacks

### ✅ Error Handling
- React Error Boundaries
- Custom error handling hooks
- Graceful error recovery
- Development error details

### ✅ Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Optimized layouts for all devices
- Progressive enhancement

## 📈 Performance Optimizations

- **Code Splitting** - Lazy loading of components
- **Memoization** - React.memo and useMemo optimizations
- **Bundle Optimization** - Vite-powered fast builds
- **Image Optimization** - Responsive images and lazy loading
- **Caching** - API response caching and local storage

## 🔒 Security Features

- **Authentication** - JWT-based secure authentication
- **Authorization** - Role-based access control
- **Rate Limiting** - API endpoint protection
- **Input Validation** - Server-side validation
- **CORS** - Cross-origin request handling
- **Error Sanitization** - Secure error messages

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
vercel --prod
```

### Backend (Render)
```bash
cd server
# Configure environment variables in Render dashboard
# Deploy via Git integration
```

### Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Alpaca Markets** - Real-time market data
- **Tailwind CSS** - Beautiful styling framework
- **React Team** - Excellent frontend framework
- **Node.js Team** - Powerful backend runtime
- **Open Source Community** - Amazing tools and libraries

## 📞 Support

If you encounter any issues or have questions:

- **Email**: support@tradefinder.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/trade-finder/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/trade-finder/wiki)

---

**Trade Finder** - Making intelligent trading accessible to everyone! 🚀📊💰
