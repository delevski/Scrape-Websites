/**
 * API Service
 * Handles all HTTP requests to the backend scraping service
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

import axios from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for scraping requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The server is taking too long to respond.');
    }
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || data?.error || `Server error (${status})`;
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

/**
 * Scrapes a website and returns both raw text and structured data
 * 
 * @async
 * @function scrapeWebsite
 * @param {string} url - The website URL to scrape
 * @returns {Promise<Object>} - Scraping results with raw text and structured data
 * @throws {Error} - Throws error if scraping fails
 */
export const scrapeWebsite = async (url) => {
  try {
    console.log(`🔍 Starting scrape for URL: ${url}`);
    
    const response = await api.post('/scrape', { url });
    
    console.log('✅ Scrape completed successfully');
    return response.data;
    
  } catch (error) {
    console.error('❌ Scrape failed:', error.message);
    throw error;
  }
};

/**
 * Checks server health status
 * 
 * @async
 * @function checkHealth
 * @returns {Promise<Object>} - Server health status
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  } catch (error) {
    throw new Error('Server is not responding');
  }
};

/**
 * Exports scraped data to Google Sheets
 * 
 * @async
 * @function exportToGoogleSheets
 * @param {Object} scrapeData - Complete scraping data to export
 * @returns {Promise<Object>} - Export result with Google Sheets URL
 * @throws {Error} - Throws error if export fails
 */
export const exportToGoogleSheets = async (scrapeData) => {
  try {
    console.log(`📊 Starting Google Sheets export for URL: ${scrapeData.url}`);
    
    const response = await api.post('/export/google-sheets', scrapeData);
    
    console.log('✅ Google Sheets export completed successfully');
    return response.data;
    
  } catch (error) {
    console.error('❌ Google Sheets export failed:', error.message);
    throw error;
  }
};

/**
 * Checks export service status
 * 
 * @async
 * @function getExportStatus
 * @returns {Promise<Object>} - Export services status
 */
export const getExportStatus = async () => {
  try {
    const response = await api.get('/export/status');
    return response.data;
  } catch (error) {
    throw new Error('Failed to check export service status');
  }
};

/**
 * Validates URL format
 * 
 * @function isValidUrl
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export default api;
