/**
 * Scraping Controller
 * Handles the business logic for web scraping operations
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

const scraper = require('../services/scraperService');
const logger = require('../utils/logger');

/**
 * Scrapes a website and returns both raw text and structured data
 * 
 * @async
 * @function scrapeWebsite
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const scrapeWebsite = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    logger.info(`Starting scrape operation for URL: ${url}`);
    
    // Validate URL format
    if (!isValidUrl(url)) {
      return res.status(400).json({
        error: 'Invalid URL format',
        message: 'Please provide a valid URL starting with http:// or https://',
      });
    }

    // Perform scraping
    const startTime = Date.now();
    const result = await scraper.scrapeUrl(url);
    const endTime = Date.now();

    logger.info(`Scrape completed in ${endTime - startTime}ms for URL: ${url}`);

    // Return structured response
    res.status(200).json({
      success: true,
      data: {
        url: url,
        timestamp: new Date().toISOString(),
        processingTime: endTime - startTime,
        rawText: result.rawText,
        structuredData: result.structuredData,
        metadata: {
          totalElements: result.structuredData.length,
          textLength: result.rawText.length,
          uniqueTags: [...new Set(result.structuredData.map(item => item.tag))].length,
        },
      },
    });

  } catch (error) {
    logger.error(`Scraping error for URL ${req.body.url}:`, error);
    
    // Handle specific error types
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(400).json({
        error: 'Connection Error',
        message: 'Unable to connect to the specified URL. Please check if the URL is correct and accessible.',
      });
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(408).json({
        error: 'Request Timeout',
        message: 'The scraping request timed out. The website may be too slow or unresponsive.',
      });
    }

    if (error.response && error.response.status === 403) {
      return res.status(403).json({
        error: 'Access Forbidden',
        message: 'The website has blocked scraping requests. This may be due to rate limiting or anti-bot protection.',
      });
    }

    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return res.status(400).json({
        error: 'Client Error',
        message: `The website returned an error (${error.response.status}). Please check the URL and try again.`,
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Scraping Failed',
      message: 'An unexpected error occurred while scraping the website. Please try again later.',
    });
  }
};

/**
 * Validates if a string is a valid URL
 * 
 * @function isValidUrl
 * @param {string} string - String to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

module.exports = {
  scrapeWebsite,
};
