# Web Scraper with Google Sheets Export

A production-grade web scraping application that extracts data from websites and exports the organized results to Google Sheets. Built with Node.js, Express, React, and integrated with Google Sheets API.

## 🚀 Features

- **Web Scraping**: Extract text content, links, and structured data from any website
- **Google Sheets Integration**: Automatically export scraped data to Google Sheets
- **Real-time Processing**: Fast scraping with loading states and progress indicators
- **Data Organization**: Structured data display with search and filter capabilities
- **Modern UI**: Clean, responsive interface built with React and TailwindCSS
- **Error Handling**: Robust error handling with user-friendly messages
- **Security**: Rate limiting, CORS protection, and input validation

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Google Sheets Setup](#google-sheets-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud Project (for Google Sheets integration)

### Clone the Repository

```bash
git clone https://github.com/yourusername/web-scraper.git
cd web-scraper
```

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```bash
PORT=5000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SCRAPING_TIMEOUT_MS=30000
MAX_CONTENT_LENGTH=10485760

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...}
```

### Google Sheets Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Sheets API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API" and enable it

3. **Create Service Account**
   - Go to "IAM & Admin" → "Service Accounts"
   - Create a new service account
   - Download the JSON credentials file

4. **Share Google Sheet**
   - Open your Google Sheet
   - Click "Share" and add the service account email as Editor
   - Copy the spreadsheet ID from the URL

5. **Configure Credentials**
   - **IMPORTANT**: Never commit credentials to version control
   - Place the JSON credentials in `server/credentials.json` (not tracked by git)
   - Or set `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` environment variable
   - The `credentials.json` file is already in `.gitignore` for security

## 🚀 Usage

### Development Mode

```bash
# Start both client and server
npm run dev

# Or start individually
npm run server  # Backend only
npm run client  # Frontend only
```

### Production Mode

```bash
# Build the client
cd client
npm run build

# Start the server
cd ../server
npm start
```

### Using the Application

1. **Open the Application**
   - Navigate to `http://localhost:3000` (or the port shown in terminal)

2. **Scrape a Website**
   - Enter a URL in the input field
   - Click "Scrape" to extract data
   - View results in raw text or structured table format

3. **Export to Google Sheets**
   - Click "Export to Google Sheets" button
   - Data will be automatically organized and exported
   - Each export creates a new sheet tab with timestamp

## 📚 API Documentation

### Endpoints

#### POST `/api/scrape`
Scrape a website and extract structured data.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "rawText": "Extracted text content...",
    "structuredData": [
      {
        "tag": "h1",
        "text": "Page Title",
        "href": null,
        "class": "main-title",
        "id": "title",
        "index": 0
      }
    ],
    "metadata": {
      "totalElements": 150,
      "textLength": 5000,
      "uniqueTags": 25,
      "processingTime": 1200
    }
  }
}
```

#### POST `/api/export/google-sheets`
Export scraped data to Google Sheets.

**Request:**
```json
{
  "url": "https://example.com",
  "structuredData": [...],
  "rawText": "...",
  "metadata": {...}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data exported to Google Sheets successfully",
  "data": {
    "sheetUrl": "https://docs.google.com/spreadsheets/d/...",
    "sheetName": "Scrape_2025-10-20T10-44-41-134Z",
    "exportedRows": 150,
    "exportTime": 8388
  }
}
```

#### GET `/api/export/status`
Check the status of export services.

**Response:**
```json
{
  "success": true,
  "data": {
    "googleSheets": {
      "available": true,
      "configured": true
    },
    "timestamp": "2025-10-20T10:44:41.134Z"
  }
}
```

## 🏗 Project Structure

```
web-scraper/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── credentials.json    # Google service account
│   └── package.json
├── README.md
├── .gitignore
└── package.json           # Root package.json
```

## 🔧 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Cheerio** - HTML parsing and manipulation
- **Axios** - HTTP client for web requests
- **Google APIs** - Google Sheets integration
- **Joi** - Request validation
- **Morgan** - HTTP request logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - CSS framework
- **Lucide React** - Icon library

### Development Tools
- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting

## 🚨 Error Handling

The application includes comprehensive error handling for:

- **Invalid URLs** - Validates URL format before scraping
- **Network Errors** - Handles timeouts and connection issues
- **Rate Limiting** - Prevents abuse with request limits
- **Google Sheets Errors** - Graceful handling of API failures
- **Validation Errors** - Input validation with detailed error messages

## 🔒 Security Features

- **Rate Limiting** - Configurable request limits
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Joi schema validation
- **Helmet Security** - Security headers
- **Environment Variables** - Sensitive data protection
- **Credential Protection** - Google service account credentials excluded from version control
- **GitHub Secret Scanning** - Automatic detection of exposed secrets

### Security Best Practices

- ✅ Never commit credentials to version control
- ✅ Use environment variables for sensitive configuration
- ✅ Regularly rotate API keys and tokens
- ✅ Use HTTPS in production environments
- ✅ Implement proper access controls
- ✅ Monitor for security vulnerabilities

## 📊 Data Export Format

### Google Sheets Structure

Each export creates:
1. **Main Data Sheet** - Structured scraped data
2. **Metadata Sheet** - Scraping information and statistics

### Data Columns
- **Tag** - HTML tag name
- **Text** - Extracted text content
- **Href** - Link URL (if applicable)
- **Class** - CSS class name
- **ID** - Element ID
- **Index** - Element position

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/web-scraper/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 🙏 Acknowledgments

- Google Sheets API for seamless data export
- Cheerio for efficient HTML parsing
- React and TailwindCSS for the modern UI
- The open-source community for amazing tools and libraries

---

**Happy Scraping! 🕷️📊**