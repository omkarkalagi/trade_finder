import redis from 'redis';

const client = redis.createClient({ url: process.env.REDIS_URL });

export const cacheMiddleware = (duration) => (req, res, next) => {
  const key = `__express__${req.originalUrl}`;

  client.get(key, (err, data) => {
    if (data) {
      res.send(JSON.parse(data));
    } else {
      const originalSend = res.send;
      res.send = (body) => {
        client.setEx(key, duration, JSON.stringify(body));
        originalSend.call(res, body);
      };
      next();
    }
  });
};
