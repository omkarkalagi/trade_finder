const NodeCache = require('node-cache');
const redis = require('redis');
const { promisify } = require('util');

// Multi-layer caching system
class AdvancedCache {
  constructor() {
    this.memoryCache = new NodeCache({ 
      stdTTL: 60, // 1 minute
      checkperiod: 30,
      useClones: false
    });
    
    this.redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: true, // Enable TLS for secure connection
        rejectUnauthorized: false // Required for Redis Cloud
      }
    });
    
    this.redisGet = promisify(this.redisClient.get).bind(this.redisClient);
    this.redisSet = promisify(this.redisClient.set).bind(this.redisClient);
  }

  async get(key, fetchFn, ttl = 300) {
    // Check memory cache first
    const memoryCached = this.memoryCache.get(key);
    if (memoryCached) {
      return memoryCached;
    }
    
    // Check Redis cache
    let redisCached = await this.redisGet(key);
    if (redisCached) {
      try {
        redisCached = JSON.parse(redisCached);
        // Store in memory cache for faster access
        this.memoryCache.set(key, redisCached);
        return redisCached;
      } catch (e) {
        console.error('Redis parse error', e);
      }
    }
    
    // Fetch from source if not in cache
    const data = await fetchFn();
    
    // Store in both caches
    this.memoryCache.set(key, data);
    await this.redisSet(key, JSON.stringify(data), 'EX', ttl);
    
    return data;
  }
}

// Global cache instance
module.exports = new AdvancedCache();