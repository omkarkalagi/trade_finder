import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?q=stock+market&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        );
        setNews(response.data.articles.slice(0, 5));
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Market News</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : news.length > 0 ? (
        <div className="space-y-4">
          {news.map((item, index) => (
            <a 
              key={index} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                  <div className="flex text-sm text-gray-500 mt-1">
                    <span>{item.source?.name || 'Unknown'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(item.publishedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                {item.urlToImage && (
                  <img 
                    src={item.urlToImage} 
                    alt={item.title} 
                    className="ml-4 w-16 h-16 object-cover rounded"
                  />
                )}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No news available
        </div>
      )}
    </div>
  );
};

export default MarketNews; 