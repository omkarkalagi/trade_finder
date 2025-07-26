const axios = require('axios');
const NEWS_API_KEY = process.env.NEWS_API_KEY;

exports.getMarketNews = async () => {
  try {
    // Add API key check
    if (!process.env.NEWS_API_KEY) {
      throw new Error('News API key is missing');
    }
    
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?q=stock+market&apiKey=${process.env.NEWS_API_KEY}`
    );
    return response.data.articles.slice(0, 5);
  } catch (error) {
    console.error('News fetch error:', error.message);
    return [];
  }
}; 