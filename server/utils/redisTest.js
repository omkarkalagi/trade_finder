const redis = require('redis');

async function testRedis() {
  try {
    const client = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false
      }
    });
    
    client.on('error', (err) => console.log('Redis Client Error', err));
    
    await client.connect();
    console.log('Successfully connected to Redis');
    
    await client.set('test_key', 'TradeFinder_test_value');
    const value = await client.get('test_key');
    console.log('Redis test successful. Value:', value);
    
    await client.quit();
  } catch (error) {
    console.error('Redis connection failed:', error);
    process.exit(1);
  }
}

testRedis(); 