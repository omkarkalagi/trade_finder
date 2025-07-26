  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });
  app.use(limiter);

  // Health check route
  app.get('/health', (req, res) => {
    console.log('✅ Health check passed');
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString()
    });
  });

  // Root endpoint redirect
  app.get('/', (req, res) => res.redirect('/health'));

  // Error handling for uncaught exceptions and rejections
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);

    // Start async initialization
    initializeServices().catch(console.error);
  });

  async function initializeServices() {
    try {
      console.log("Starting async service initialization...");

      // Connect to Redis
      const redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      console.log("✅ Redis connected");

      // Initialize market data stream
      await initializeMarketDataStream();
      console.log("✅ Market data stream initialized");
    } catch (err) {
      console.error("Initialization error:", err);
    }
  }
}

// Placeholder functions (implement these in separate files)
async function initializeMarketDataStream() {
  console.log("Market data stream starting...");
  // Implement your market data stream logic here
}
