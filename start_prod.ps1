# Set environment variables
$env:NODE_ENV="production"
$env:REDIS_URL="redis://default:5vI6YjHeIZIn30bmFIALhkTK0E1c7Zog@redis-16424.c309.us-east-2-1.ec2.redns.redis-cloud.com:16424"

# Start server
cd server
npm install
node index.js

# In a separate terminal (run manually):
# cd ../client
# npm run build
# serve -s build -l 3000 