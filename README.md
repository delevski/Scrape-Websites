# Web Scraper Application

A **production-grade web scraping application** built with modern technologies and best practices. This application allows users to input a website URL, performs comprehensive web scraping, and displays results in both raw text and structured table formats.

## 🚀 Features

### Core Functionality
- **URL Input & Validation**: Secure URL input with real-time validation
- **Web Scraping**: Robust scraping using Cheerio with comprehensive error handling
- **Dual Display**: Raw text extraction and structured HTML element parsing
- **Search & Filter**: Advanced filtering capabilities for structured data
- **Export Options**: Download results as TXT, JSON, or CSV formats
- **Responsive Design**: Modern, mobile-friendly UI with dark mode support

### Technical Features
- **Production-Ready Architecture**: Clean separation of concerns with modular design
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Security**: Helmet.js security headers and input validation
- **Performance**: Optimized for speed with proper loading states
- **Accessibility**: WCAG-compliant design with proper ARIA labels

## 🏗️ Architecture

### Backend (Node.js + Express)
```
server/
├── controllers/          # Business logic controllers
│   └── scrapeController.js
├── routes/              # API route definitions
│   └── scrape.js
├── services/            # Core scraping service
│   └── scraperService.js
├── utils/               # Utility functions
│   ├── errorHandler.js
│   ├── logger.js
│   └── validation.js
├── index.js            # Main server file
└── package.json
```

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/      # React components
│   │   ├── ScrapeForm.jsx
│   │   ├── ResultsDisplay.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── services/        # API service layer
│   │   └── api.js
│   ├── utils/           # Utility functions
│   │   └── cn.js
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html
└── package.json
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Cheerio** - HTML parsing and manipulation
- **Axios** - HTTP client for web requests
- **Joi** - Input validation
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Development Tools
- **Concurrently** - Run multiple npm scripts
- **Nodemon** - Auto-restart server during development
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd Scrape-Websites

# Install all dependencies (root, server, and client)
npm run install-all
```

### 2. Environment Setup

```bash
# Copy environment variables template
cp server/env.example server/.env

# Edit the .env file with your preferred settings (optional)
# The application will work with default values
```

### 3. Start Development Servers

```bash
# Start both frontend and backend servers
npm run dev
```

This command will start:
- **Backend server** on `http://localhost:5000`
- **Frontend application** on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

### Basic Scraping
1. **Enter URL**: Input any valid website URL (must start with `http://` or `https://`)
2. **Click Scrape**: Click the "Scrape Website" button to start the process
3. **View Results**: Browse the results in two formats:
   - **Raw Text**: Complete extracted text content
   - **Structured Data**: Organized table with HTML elements

### Advanced Features
- **Search & Filter**: Use the search bar in structured data view to filter elements
- **Export Data**: Download results as TXT, JSON, or CSV files
- **Copy to Clipboard**: Copy raw text or structured data to clipboard
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Example URLs to Try
- `https://example.com` - Simple test page
- `https://news.ycombinator.com` - News aggregator with structured content
- `https://github.com` - Complex website with rich content
- `https://httpbin.org/html` - HTML testing endpoint

## 🔧 Configuration

### Environment Variables

Create a `server/.env` file with the following options:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # Max requests per window

# Scraping Configuration
SCRAPING_TIMEOUT_MS=30000      # 30 seconds timeout
MAX_CONTENT_LENGTH=10485760    # 10MB max content
```

### Frontend Configuration

Create a `client/.env` file for frontend environment variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Available Scripts

### Root Level Scripts
```bash
npm run dev          # Start both frontend and backend
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production
npm start           # Start production server
```

### Backend Scripts
```bash
cd server
npm run dev         # Start with nodemon (development)
npm start          # Start production server
```

### Frontend Scripts
```bash
cd client
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🏗️ Production Deployment

### Build for Production

```bash
# Build the frontend
npm run build

# The built files will be in client/dist/
```

### Environment Setup

1. Set `NODE_ENV=production` in your environment
2. Configure production database if needed
3. Set up proper CORS origins for your domain
4. Configure rate limiting for production traffic
5. Set up logging and monitoring

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile for production
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm run install-all

# Build frontend
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

## 🧪 API Documentation

### Scrape Endpoint

**POST** `/api/scrape`

Scrapes a website and returns both raw text and structured data.

#### Request Body
```json
{
  "url": "https://example.com"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "processingTime": 1234,
    "rawText": "Extracted text content...",
    "structuredData": [
      {
        "tag": "h1",
        "text": "Page Title",
        "href": null,
        "class": "main-title",
        "id": "page-title"
      }
    ],
    "metadata": {
      "totalElements": 150,
      "textLength": 5432,
      "uniqueTags": 12
    }
  }
}
```

### Health Check

**GET** `/health`

Returns server health status.

#### Response
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

## 🛡️ Security Features

- **Input Validation**: Comprehensive URL and input validation using Joi
- **Rate Limiting**: Configurable rate limiting to prevent abuse
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Proper CORS configuration
- **Error Handling**: Secure error messages without sensitive information
- **Content Length Limits**: Protection against large content attacks

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with TailwindCSS
- **Dark Mode Support**: Automatic dark mode detection and manual toggle
- **Responsive Layout**: Mobile-first responsive design
- **Loading States**: Proper loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages with recovery options
- **Accessibility**: WCAG-compliant design with proper ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility support

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Or change port in server/.env
   PORT=5001
   ```

2. **CORS Errors**
   ```bash
   # Ensure frontend is running on port 3000
   # Or update CORS configuration in server/index.js
   ```

3. **Scraping Timeouts**
   ```bash
   # Increase timeout in server/.env
   SCRAPING_TIMEOUT_MS=60000
   ```

4. **Large Content Issues**
   ```bash
   # Increase content length limit
   MAX_CONTENT_LENGTH=20971520  # 20MB
   ```

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cheerio** - For powerful HTML parsing capabilities
- **TailwindCSS** - For the excellent utility-first CSS framework
- **React** - For the robust component-based UI library
- **Express.js** - For the minimal and flexible web framework

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ by Senior Full-Stack Developer**