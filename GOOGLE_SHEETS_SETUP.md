# Google Sheets Export Setup Guide

This guide will help you set up Google Sheets export functionality for your web scraping application.

## 📋 Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. A Google Sheets document where you want to export the data

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing project
3. Note down your project ID

### Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - **Name**: `web-scraper-sheets`
   - **Description**: `Service account for web scraping Google Sheets export`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 4: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Choose "JSON" format
6. Download the JSON file and keep it secure

### Step 5: Create Google Sheets Document

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Note the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
4. Copy the `SPREADSHEET_ID` part

### Step 6: Share Spreadsheet with Service Account

1. In your Google Sheets document, click "Share"
2. Add the service account email (from the JSON file) as an editor
3. The email looks like: `web-scraper-sheets@your-project.iam.gserviceaccount.com`

### Step 7: Configure Environment Variables

1. Open the downloaded JSON file
2. Copy the entire contents
3. In your server directory, edit the `.env` file:

```env
# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"web-scraper-sheets@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/web-scraper-sheets%40your-project.iam.gserviceaccount.com"}
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

**Important**: 
- Replace the entire JSON object with your actual service account credentials
- Replace `your-spreadsheet-id-here` with your actual spreadsheet ID
- Keep the JSON on a single line (no line breaks)

### Step 8: Restart the Server

```bash
cd server
npm run dev
```

## 🧪 Testing the Setup

1. Start your application: `npm run dev`
2. Scrape a website
3. Click "Export to Google Sheets"
4. Check your Google Sheets document for the new data

## 📊 What Gets Exported

The export creates:

1. **Main Data Sheet**: Contains all scraped elements with columns:
   - Index
   - HTML Tag
   - Text Content
   - Href/Link
   - CSS Class
   - Element ID
   - Image Src
   - Image Alt
   - Input Type
   - Input Name

2. **Metadata Sheet**: Contains scraping information:
   - Source URL
   - Export timestamp
   - Total elements count
   - Text length
   - Unique tags count
   - Processing time

## 🔒 Security Best Practices

1. **Never commit the `.env` file** to version control
2. **Keep the service account JSON file secure**
3. **Limit service account permissions** to only what's needed
4. **Regularly rotate service account keys**
5. **Use environment-specific spreadsheets** for different deployments

## 🐛 Troubleshooting

### Common Issues

1. **"Google Sheets service not configured"**
   - Check that environment variables are set correctly
   - Verify the JSON format is valid (no line breaks)

2. **"Authentication Error"**
   - Verify the service account email has access to the spreadsheet
   - Check that the service account key is valid

3. **"Permission denied"**
   - Ensure the service account email is added as an editor to the spreadsheet
   - Verify the spreadsheet ID is correct

4. **"Rate limit exceeded"**
   - Google Sheets API has quotas; wait and try again
   - Consider implementing retry logic

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📈 API Limits

- **Google Sheets API**: 100 requests per 100 seconds per user
- **Maximum cells per request**: 10 million cells
- **Maximum rows per sheet**: 10 million rows

## 🔄 Alternative: Manual Export

If you prefer not to set up Google Sheets integration, the application still provides:
- **CSV Export**: Download structured data as CSV
- **JSON Export**: Download complete data as JSON
- **TXT Export**: Download raw text content

## 📞 Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple website first (e.g., https://example.com)
4. Ensure your Google Cloud project has billing enabled (required for API usage)

---

**Note**: Google Sheets export is an optional feature. The application works perfectly without it, providing local file exports instead.
