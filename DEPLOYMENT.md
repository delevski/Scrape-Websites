# Deployment Guide

This guide covers deploying the Web Scraper application to various platforms and environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Variables](#environment-variables)
- [Security Considerations](#security-considerations)
- [Monitoring and Logging](#monitoring-and-logging)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud Project (for Google Sheets integration)
- Git

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/web-scraper.git
cd web-scraper
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Environment Configuration

Create environment files:

```bash
# Server environment
cp server/env.example server/.env

# Client environment (if needed)
cp client/env.example client/.env
```

## Local Development

### Development Mode

```bash
# Start both client and server in development mode
npm run dev
```

This will:
- Start the server on `http://localhost:5000`
- Start the client on `http://localhost:3000`
- Enable hot reloading for both frontend and backend

### Individual Services

```bash
# Start only the server
npm run server

# Start only the client
npm run client
```

## Production Deployment

### 1. Build the Application

```bash
# Build the client for production
cd client
npm run build
cd ..
```

### 2. Start Production Server

```bash
# Start the server in production mode
cd server
npm start
```

### 3. Serve Static Files

For production, you may want to serve the built client files from the server:

```javascript
// In server/index.js
const path = require('path');

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
```

## Docker Deployment

### 1. Create Dockerfile

**Server Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server code
COPY server/ .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
```

**Client Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY client/package*.json ./
RUN npm ci

# Copy client code and build
COPY client/ .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose

```yaml
version: '3.8'

services:
  server:
    build:
      context: .
      dockerfile: server/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    env_file:
      - server/.env
    volumes:
      - ./server/credentials.json:/app/credentials.json:ro

  client:
    build:
      context: .
      dockerfile: client/Dockerfile
    ports:
      - "80:80"
    depends_on:
      - server

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - server
      - client
```

### 3. Build and Run

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Cloud Deployment

### Heroku

1. **Install Heroku CLI**

2. **Create Heroku App**
```bash
heroku create your-app-name
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
heroku config:set GOOGLE_SERVICE_ACCOUNT_CREDENTIALS='{"type":"service_account",...}'
```

4. **Deploy**
```bash
git push heroku main
```

### Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set Environment Variables**
```bash
vercel env add GOOGLE_SPREADSHEET_ID
vercel env add GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
```

### AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (ports 22, 80, 443, 5000)
   - Attach Elastic IP

2. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

3. **Deploy Application**
```bash
# Clone repository
git clone https://github.com/yourusername/web-scraper.git
cd web-scraper

# Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Build client
cd client && npm run build && cd ..

# Configure environment
cp server/env.example server/.env
# Edit server/.env with production values
```

4. **Configure PM2**
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'web-scraper',
    script: 'server/index.js',
    cwd: '/home/ubuntu/web-scraper',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

5. **Configure Nginx**
```bash
sudo cat > /etc/nginx/sites-available/web-scraper << EOF
server {
    listen 80;
    server_name your-domain.com;

    # Serve client files
    location / {
        root /home/ubuntu/web-scraper/client/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/web-scraper /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Environment Variables

### Server Environment Variables

```bash
# Application
NODE_ENV=production
PORT=5000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Scraping Configuration
SCRAPING_TIMEOUT_MS=30000
MAX_CONTENT_LENGTH=10485760

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...}
```

### Client Environment Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Web Scraper
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use secure methods to store sensitive credentials
- Rotate API keys regularly

### 2. HTTPS
- Always use HTTPS in production
- Configure SSL certificates
- Redirect HTTP to HTTPS

### 3. CORS Configuration
```javascript
// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
};
```

### 4. Rate Limiting
```javascript
// Configure rate limiting for production
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP'
});
```

### 5. Input Validation
- Validate all inputs
- Sanitize user data
- Use parameterized queries

## Monitoring and Logging

### 1. Logging Configuration

```javascript
// Configure logging for production
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'web-scraper' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 2. Health Monitoring

```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

### 3. Error Monitoring

Consider integrating with services like:
- Sentry for error tracking
- DataDog for monitoring
- New Relic for performance monitoring

## Performance Optimization

### 1. Caching
```javascript
// Add Redis caching
const redis = require('redis');
const client = redis.createClient();

// Cache scraped data
const cacheKey = `scrape:${url}`;
const cachedData = await client.get(cacheKey);

if (cachedData) {
  return JSON.parse(cachedData);
}

// Store in cache after scraping
await client.setex(cacheKey, 3600, JSON.stringify(scrapedData));
```

### 2. Database
- Consider using a database for storing scraped data
- Implement data archiving strategies
- Use database indexes for better performance

### 3. Load Balancing
- Use multiple server instances
- Implement load balancing with Nginx
- Use PM2 cluster mode

```bash
# Start multiple instances with PM2
pm2 start ecosystem.config.js -i max
```

## Backup and Recovery

### 1. Data Backup
```bash
# Backup Google Sheets data
# Set up automated backups for critical data
# Store backups in secure locations
```

### 2. Application Backup
```bash
# Backup application code
git push origin main

# Backup configuration files
tar -czf config-backup.tar.gz server/.env server/credentials.json
```

### 3. Disaster Recovery
- Document recovery procedures
- Test backup restoration
- Maintain offline copies of critical data

## Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Find and kill process using port
lsof -ti:5000 | xargs kill -9
```

2. **Permission Denied**
```bash
# Fix file permissions
chmod +x server/index.js
chown -R $USER:$USER /path/to/app
```

3. **Memory Issues**
```bash
# Monitor memory usage
pm2 monit

# Restart application if needed
pm2 restart web-scraper
```

4. **Google Sheets Authentication**
- Verify service account credentials
- Check API permissions
- Ensure spreadsheet is shared with service account

### Log Analysis

```bash
# View application logs
pm2 logs web-scraper

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View system logs
journalctl -u nginx -f
```

## Maintenance

### Regular Tasks

1. **Update Dependencies**
```bash
npm audit fix
npm update
```

2. **Monitor Performance**
```bash
pm2 monit
```

3. **Check Logs**
```bash
pm2 logs --lines 100
```

4. **Backup Data**
- Schedule regular backups
- Test backup restoration

### Security Updates

- Keep dependencies updated
- Monitor security advisories
- Apply security patches promptly
- Regular security audits
