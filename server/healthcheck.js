const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/test',
  timeout: 2000
};

const request = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', err => {
  console.error('HEALTHCHECK FAILED', err);
  process.exit(1);
});

request.end(); 