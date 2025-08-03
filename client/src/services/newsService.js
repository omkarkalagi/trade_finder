class NewsService {
  constructor() {
    this.newsCache = [];
    this.lastFetch = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    this.isLoading = false;

    // Initialize with some sample news
    this.initializeNews();
  }

  // Initialize with sample news data
  initializeNews() {
    this.newsCache = [
      {
        id: 1,
        title: "Nifty 50 Hits New All-Time High Amid Strong FII Inflows",
        summary: "The benchmark Nifty 50 index reached a new record high today, driven by strong foreign institutional investor inflows and positive global cues.",
        content: "The Indian stock market witnessed a remarkable rally today as the Nifty 50 index surged to a new all-time high of 22,850 points. The rally was primarily driven by strong foreign institutional investor (FII) inflows, which have exceeded ₹15,000 crores in the past week. Banking and IT stocks led the charge, with HDFC Bank, ICICI Bank, and TCS contributing significantly to the index gains. Market analysts attribute this surge to improved global sentiment, strong Q3 earnings expectations, and the Reserve Bank of India's accommodative monetary policy stance.",
        source: "Economic Times",
        category: "Market",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
        tags: ["Nifty", "FII", "Banking", "IT"],
        sentiment: "positive"
      },
      {
        id: 2,
        title: "RBI Maintains Repo Rate at 6.5%, Focuses on Inflation Control",
        summary: "The Reserve Bank of India kept the repo rate unchanged at 6.5% in its latest monetary policy review, citing inflation concerns.",
        content: "The Reserve Bank of India's Monetary Policy Committee (MPC) unanimously decided to keep the repo rate unchanged at 6.5% for the fourth consecutive meeting. RBI Governor Shaktikanta Das emphasized the central bank's commitment to bringing inflation down to the 4% target while supporting economic growth. The decision was widely expected by market participants, with most economists predicting a status quo. The RBI also revised its GDP growth forecast for FY24 to 6.5% from the earlier estimate of 6.8%.",
        source: "Business Standard",
        category: "Policy",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
        tags: ["RBI", "Repo Rate", "Inflation", "Monetary Policy"],
        sentiment: "neutral"
      },
      {
        id: 3,
        title: "Reliance Industries Reports Strong Q3 Results, Stock Surges 5%",
        summary: "Reliance Industries posted better-than-expected Q3 results with strong performance across all business segments.",
        content: "Reliance Industries Limited (RIL) reported robust third-quarter results, with consolidated net profit rising 12% year-on-year to ₹18,951 crores. The company's revenue increased by 8% to ₹2,35,122 crores, driven by strong performance in the oil-to-chemicals (O2C) business and steady growth in retail and digital services. The retail segment saw a 19% growth in revenue, while Jio Platforms maintained its subscriber growth momentum. Following the results announcement, RIL shares surged 5% in after-market trading.",
        source: "Mint",
        category: "Earnings",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop",
        tags: ["Reliance", "Q3 Results", "Earnings", "Oil"],
        sentiment: "positive"
      },
      {
        id: 4,
        title: "IT Sector Faces Headwinds as Global Tech Spending Slows",
        summary: "Indian IT companies are bracing for challenging times as global technology spending shows signs of deceleration.",
        content: "The Indian information technology sector is facing headwinds as global technology spending shows signs of slowing down. Major IT services companies like TCS, Infosys, and Wipro have reported cautious commentary from clients, particularly in the BFSI and retail sectors. Analysts expect the sector to face margin pressures in the coming quarters due to wage inflation and reduced discretionary spending by clients. However, companies are focusing on digital transformation projects and cloud migration services to offset the impact.",
        source: "Financial Express",
        category: "Sector",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop",
        tags: ["IT Sector", "TCS", "Infosys", "Technology"],
        sentiment: "negative"
      },
      {
        id: 5,
        title: "Auto Sector Shows Signs of Recovery with Festive Season Boost",
        summary: "The automobile sector is witnessing a gradual recovery with improved sales during the festive season.",
        content: "The Indian automobile sector is showing signs of recovery with improved sales figures during the recent festive season. Two-wheeler sales have picked up significantly, with companies like Hero MotoCorp and Bajaj Auto reporting double-digit growth. The passenger vehicle segment has also shown resilience, with Maruti Suzuki and Hyundai leading the charge. However, commercial vehicle sales remain subdued due to slower economic activity. Industry experts believe the sector's recovery will depend on rural demand and overall economic growth.",
        source: "Moneycontrol",
        category: "Sector",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=200&fit=crop",
        tags: ["Auto Sector", "Maruti", "Hero MotoCorp", "Festive Sales"],
        sentiment: "positive"
      }
    ];
  }

  // Fetch latest news from multiple sources
  async fetchLatestNews() {
    if (this.isLoading) return this.newsCache;

    // Check cache validity
    if (this.lastFetch && (Date.now() - this.lastFetch) < this.cacheExpiry) {
      return this.newsCache;
    }

    this.isLoading = true;

    try {
      // Try to fetch from NewsAPI (requires API key)
      await this.fetchFromNewsAPI();
    } catch (error) {
      console.warn('NewsAPI failed, trying alternative sources:', error);
      try {
        // Try Alpha Vantage News
        await this.fetchFromAlphaVantage();
      } catch (error2) {
        console.warn('Alpha Vantage failed, generating fresh sample news:', error2);
        this.generateFreshNews();
      }
    }

    this.lastFetch = Date.now();
    this.isLoading = false;
    return this.newsCache;
  }

  // Fetch from NewsAPI
  async fetchFromNewsAPI() {
    const API_KEY = process.env.VITE_NEWS_API_KEY;
    if (!API_KEY) throw new Error('NewsAPI key not found');

    const queries = [
      'Indian stock market',
      'NSE BSE',
      'RBI monetary policy',
      'Indian economy',
      'Nifty Sensex'
    ];

    const allNews = [];

    for (const query of queries) {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${API_KEY}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (data.articles) {
          const processedArticles = data.articles.map((article, index) => ({
            id: Date.now() + index,
            title: article.title,
            summary: article.description || article.title,
            content: article.content || article.description || 'Full content not available.',
            source: article.source.name,
            category: this.categorizeNews(article.title + ' ' + article.description),
            timestamp: new Date(article.publishedAt),
            image: article.urlToImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
            url: article.url,
            tags: this.extractTags(article.title + ' ' + article.description),
            sentiment: this.analyzeSentiment(article.title + ' ' + article.description)
          }));

          allNews.push(...processedArticles);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.warn(`Failed to fetch news for query "${query}":`, error);
      }
    }

    if (allNews.length > 0) {
      // Sort by timestamp and take latest 20
      this.newsCache = allNews
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 20);
    }
  }

  // Fetch from Alpha Vantage News
  async fetchFromAlphaVantage() {
    const API_KEY = process.env.VITE_ALPHA_VANTAGE_KEY || 'demo';

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=RELIANCE.BSE,TCS.BSE,HDFCBANK.BSE&apikey=${API_KEY}`
      );

      const data = await response.json();

      if (data.feed) {
        const processedNews = data.feed.slice(0, 10).map((item, index) => ({
          id: Date.now() + index,
          title: item.title,
          summary: item.summary,
          content: item.summary,
          source: item.source,
          category: this.categorizeNews(item.title),
          timestamp: new Date(item.time_published),
          image: item.banner_image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
          url: item.url,
          tags: this.extractTags(item.title + ' ' + item.summary),
          sentiment: parseFloat(item.overall_sentiment_score) > 0 ? 'positive' :
                    parseFloat(item.overall_sentiment_score) < 0 ? 'negative' : 'neutral'
        }));

        this.newsCache = [...processedNews, ...this.newsCache.slice(0, 10)];
      }
    } catch (error) {
      throw new Error('Alpha Vantage news fetch failed');
    }
  }

  // Generate fresh sample news with current timestamps
  generateFreshNews() {
    const templates = [
      {
        title: "Market Update: Nifty {action} {points} Points on {reason}",
        category: "Market",
        sentiment: "neutral"
      },
      {
        title: "{company} Reports {performance} Q{quarter} Results",
        category: "Earnings",
        sentiment: "positive"
      },
      {
        title: "RBI {action} Interest Rates, Market Reacts {reaction}",
        category: "Policy",
        sentiment: "neutral"
      },
      {
        title: "{sector} Sector Shows {trend} Amid {factor}",
        category: "Sector",
        sentiment: "positive"
      }
    ];

    const variables = {
      action: ['Gains', 'Loses', 'Surges', 'Drops', 'Maintains'],
      points: ['150', '200', '300', '100', '250'],
      reason: ['Strong FII Inflows', 'Global Cues', 'Earnings Optimism', 'Policy Support'],
      company: ['Reliance', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank'],
      performance: ['Strong', 'Weak', 'Mixed', 'Better-than-Expected'],
      quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
      reaction: ['Positively', 'Negatively', 'Mixed'],
      sector: ['Banking', 'IT', 'Auto', 'Pharma', 'FMCG'],
      trend: ['Growth', 'Recovery', 'Challenges', 'Momentum'],
      factor: ['Economic Reforms', 'Global Trends', 'Policy Changes']
    };

    // Generate 5 fresh news items
    for (let i = 0; i < 5; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      let title = template.title;

      // Replace placeholders
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        const randomValue = variables[key][Math.floor(Math.random() * variables[key].length)];
        title = title.replace(regex, randomValue);
      });

      const newsItem = {
        id: Date.now() + i,
        title,
        summary: `${title}. Market analysts are closely watching the developments and their impact on investor sentiment.`,
        content: `${title}. This development comes amid ongoing market volatility and changing investor sentiment. Market participants are advised to stay updated with the latest developments and make informed investment decisions.`,
        source: ['Economic Times', 'Business Standard', 'Mint', 'Financial Express'][Math.floor(Math.random() * 4)],
        category: template.category,
        timestamp: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000), // Random time within last 2 hours
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
        tags: this.extractTags(title),
        sentiment: template.sentiment
      };

      // Add to beginning of cache
      this.newsCache.unshift(newsItem);
    }

    // Keep only latest 20 items
    this.newsCache = this.newsCache.slice(0, 20);
  }

  // Categorize news based on content
  categorizeNews(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('nifty') || lowerText.includes('sensex') || lowerText.includes('market')) {
      return 'Market';
    } else if (lowerText.includes('rbi') || lowerText.includes('policy') || lowerText.includes('rate')) {
      return 'Policy';
    } else if (lowerText.includes('result') || lowerText.includes('earning') || lowerText.includes('profit')) {
      return 'Earnings';
    } else if (lowerText.includes('sector') || lowerText.includes('industry')) {
      return 'Sector';
    } else {
      return 'General';
    }
  }

  // Extract relevant tags from text
  extractTags(text) {
    const keywords = [
      'Nifty', 'Sensex', 'RBI', 'FII', 'Banking', 'IT', 'Auto', 'Pharma',
      'Reliance', 'TCS', 'HDFC', 'Infosys', 'ICICI', 'Earnings', 'Results',
      'Policy', 'Rate', 'Inflation', 'GDP', 'Market', 'Stock'
    ];

    return keywords.filter(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 4);
  }

  // Simple sentiment analysis
  analyzeSentiment(text) {
    const positiveWords = ['gain', 'surge', 'rise', 'strong', 'growth', 'positive', 'up', 'high', 'boost'];
    const negativeWords = ['fall', 'drop', 'decline', 'weak', 'loss', 'negative', 'down', 'low', 'concern'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Get news by category
  getNewsByCategory(category) {
    return this.newsCache.filter(news => news.category === category);
  }

  // Get latest news (default 10)
  getLatestNews(limit = 10) {
    return this.newsCache
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // Search news
  searchNews(query) {
    const lowerQuery = query.toLowerCase();
    return this.newsCache.filter(news =>
      news.title.toLowerCase().includes(lowerQuery) ||
      news.summary.toLowerCase().includes(lowerQuery) ||
      news.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get news by sentiment
  getNewsBySentiment(sentiment) {
    return this.newsCache.filter(news => news.sentiment === sentiment);
  }

  // Get all categories
  getCategories() {
    const categories = [...new Set(this.newsCache.map(news => news.category))];
    return categories.map(category => ({
      name: category,
      count: this.newsCache.filter(news => news.category === category).length
    }));
  }
}

// Create singleton instance
const newsService = new NewsService();

export default newsService;
