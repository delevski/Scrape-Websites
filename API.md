# API Documentation

## Overview

The Web Scraper API provides endpoints for scraping websites and exporting data to Google Sheets. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication for scraping endpoints. Google Sheets integration requires proper service account credentials.

## Endpoints

### 1. Scrape Website

**Endpoint:** `POST /api/scrape`

**Description:** Scrapes a website and extracts structured data including text content, links, and metadata.

**Request Body:**
```json
{
  "url": "string (required)"
}
```

**Request Validation:**
- URL must be a valid HTTP or HTTPS URL
- URL is required

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "rawText": "Extracted text content from the website...",
    "structuredData": [
      {
        "tag": "h1",
        "text": "Page Title",
        "href": null,
        "class": "main-title",
        "id": "title",
        "index": 0
      },
      {
        "tag": "a",
        "text": "Link Text",
        "href": "https://example.com/page",
        "class": "nav-link",
        "id": null,
        "index": 1
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

**Error Response:**
```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": [
    {
      "field": "url",
      "message": "URL must be a valid HTTP or HTTPS URL"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### 2. Export to Google Sheets

**Endpoint:** `POST /api/export/google-sheets`

**Description:** Exports scraped data to Google Sheets with organized structure.

**Request Body:**
```json
{
  "url": "string (required)",
  "structuredData": [
    {
      "tag": "string (required)",
      "text": "string (required)",
      "href": "string (optional)",
      "class": "string (optional)",
      "id": "string (optional)",
      "index": "number (optional)"
    }
  ],
  "rawText": "string (required)",
  "metadata": {
    "totalElements": "number (required)",
    "textLength": "number (required)",
    "uniqueTags": "number (required)",
    "processingTime": "number (optional)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data exported to Google Sheets successfully",
  "data": {
    "sheetUrl": "https://docs.google.com/spreadsheets/d/19HR93NB-D2JJSqDxYkG5WzDIo2L-N_nrQSnotV3imgU/edit#gid=0",
    "sheetName": "Scrape_2025-10-20T10-44-41-134Z",
    "exportedRows": 150,
    "exportTime": 8388
  }
}
```

**Error Response:**
```json
{
  "error": "Authentication Error",
  "message": "Failed to authenticate with Google Sheets API. Please check credentials."
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `403` - Forbidden (authentication error)
- `500` - Internal Server Error

### 3. Export Status

**Endpoint:** `GET /api/export/status`

**Description:** Checks the status of export services and their configuration.

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

**Status Codes:**
- `200` - Success
- `500` - Internal Server Error

### 4. Health Check

**Endpoint:** `GET /health`

**Description:** Basic health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-20T10:44:41.134Z",
  "uptime": 1234567.89
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window:** 15 minutes (900,000 ms)
- **Max Requests:** 100 requests per window
- **Headers:** Rate limit information is included in response headers

## Error Handling

### Common Error Types

1. **Validation Errors (400)**
   - Invalid URL format
   - Missing required fields
   - Invalid data types

2. **Authentication Errors (403)**
   - Invalid Google service account credentials
   - Missing API permissions

3. **Rate Limit Errors (429)**
   - Too many requests in time window

4. **Server Errors (500)**
   - Internal server errors
   - Google API failures
   - Network timeouts

### Error Response Format

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Specific field error message"
    }
  ]
}
```

## Request/Response Examples

### Example 1: Scrape a Website

**Request:**
```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "rawText": "Example Domain\nThis domain is for use in illustrative examples in documents...",
    "structuredData": [
      {
        "tag": "h1",
        "text": "Example Domain",
        "href": null,
        "class": null,
        "id": null,
        "index": 0
      }
    ],
    "metadata": {
      "totalElements": 5,
      "textLength": 125,
      "uniqueTags": 3,
      "processingTime": 923
    }
  }
}
```

### Example 2: Export to Google Sheets

**Request:**
```bash
curl -X POST http://localhost:5000/api/export/google-sheets \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "structuredData": [...],
    "rawText": "...",
    "metadata": {...}
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Data exported to Google Sheets successfully",
  "data": {
    "sheetUrl": "https://docs.google.com/spreadsheets/d/19HR93NB-D2JJSqDxYkG5WzDIo2L-N_nrQSnotV3imgU/edit#gid=0",
    "sheetName": "Scrape_2025-10-20T10-44-41-134Z",
    "exportedRows": 5,
    "exportTime": 8388
  }
}
```

## Data Structures

### Structured Data Object

```typescript
interface StructuredDataItem {
  tag: string;        // HTML tag name (e.g., "h1", "p", "a")
  text: string;       // Extracted text content
  href?: string;      // Link URL (for anchor tags)
  class?: string;     // CSS class name
  id?: string;        // Element ID
  index: number;      // Position in the document
}
```

### Metadata Object

```typescript
interface Metadata {
  totalElements: number;    // Total number of elements scraped
  textLength: number;       // Total character count
  uniqueTags: number;       // Number of unique HTML tags
  processingTime?: number;  // Processing time in milliseconds
}
```

## Configuration

### Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

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

## Testing

### Using curl

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test scrape endpoint
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Test export endpoint
curl -X POST http://localhost:5000/api/export/google-sheets \
  -H "Content-Type: application/json" \
  -d @export_payload.json

# Test status endpoint
curl http://localhost:5000/api/export/status
```

### Using JavaScript/Fetch

```javascript
// Scrape a website
const response = await fetch('http://localhost:5000/api/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com'
  })
});

const data = await response.json();
console.log(data);
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the frontend URL is allowed in CORS configuration
   - Check if the server is running on the correct port

2. **Google Sheets Authentication**
   - Verify service account credentials are correct
   - Ensure Google Sheets API is enabled
   - Check if the service account has access to the spreadsheet

3. **Rate Limiting**
   - Check if you've exceeded the rate limit
   - Wait for the rate limit window to reset

4. **Network Timeouts**
   - Increase the timeout value in configuration
   - Check network connectivity
   - Verify the target URL is accessible
