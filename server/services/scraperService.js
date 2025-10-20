/**
 * Scraper Service
 * Core service for web scraping operations using Cheerio
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

// Configuration
const SCRAPING_TIMEOUT = parseInt(process.env.SCRAPING_TIMEOUT_MS) || 30000;
const MAX_CONTENT_LENGTH = parseInt(process.env.MAX_CONTENT_LENGTH) || 10 * 1024 * 1024; // 10MB

/**
 * Main scraping function that processes a URL and returns both raw text and structured data
 * 
 * @async
 * @function scrapeUrl
 * @param {string} url - The URL to scrape
 * @returns {Promise<Object>} - Object containing rawText and structuredData
 */
const scrapeUrl = async (url) => {
  try {
    logger.info(`Fetching content from URL: ${url}`);

    // Fetch the webpage content
    const response = await axios.get(url, {
      timeout: SCRAPING_TIMEOUT,
      maxContentLength: MAX_CONTENT_LENGTH,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    // Load HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Extract raw text (remove scripts, styles, and other non-content elements)
    const rawText = extractRawText($);

    // Extract structured data
    const structuredData = extractStructuredData($);

    logger.info(`Successfully scraped ${url}: ${structuredData.length} elements, ${rawText.length} characters`);

    return {
      rawText,
      structuredData,
    };

  } catch (error) {
    logger.error(`Scraping failed for URL ${url}:`, error);
    throw error;
  }
};

/**
 * Extracts raw text content from the webpage
 * 
 * @function extractRawText
 * @param {Object} $ - Cheerio instance
 * @returns {string} - Clean raw text content
 */
const extractRawText = ($) => {
  // Remove unwanted elements
  $('script, style, noscript, iframe, embed, object').remove();
  
  // Get text content from body, or document if body doesn't exist
  const textContent = $('body').length > 0 ? $('body') : $('html');
  
  return textContent
    .text()
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();
};

/**
 * Extracts structured data from HTML elements
 * 
 * @function extractStructuredData
 * @param {Object} $ - Cheerio instance
 * @returns {Array} - Array of structured element objects
 */
const extractStructuredData = ($) => {
  const structuredData = [];
  
  // Define which elements we want to extract
  const targetElements = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', // Headings
    'p', 'div', 'span', 'article', 'section', // Content containers
    'a', 'button', // Interactive elements
    'img', 'figure', 'figcaption', // Media elements
    'ul', 'ol', 'li', // Lists
    'table', 'tr', 'td', 'th', // Tables
    'form', 'input', 'textarea', 'select', // Form elements
    'nav', 'header', 'footer', 'aside', // Layout elements
    'blockquote', 'cite', 'code', 'pre', // Special content
  ];

  targetElements.forEach(tagName => {
    $(tagName).each((index, element) => {
      const $element = $(element);
      const text = $element.text().trim();
      
      // Skip empty elements
      if (!text) return;
      
      const elementData = {
        tag: tagName,
        text: text,
        index: structuredData.length + 1,
      };

      // Add href for links
      if (tagName === 'a') {
        const href = $element.attr('href');
        if (href) {
          elementData.href = href;
        }
      }

      // Add src for images
      if (tagName === 'img') {
        const src = $element.attr('src');
        const alt = $element.attr('alt');
        if (src) {
          elementData.src = src;
        }
        if (alt) {
          elementData.alt = alt;
        }
      }

      // Add type for inputs
      if (tagName === 'input') {
        const type = $element.attr('type');
        const name = $element.attr('name');
        if (type) {
          elementData.type = type;
        }
        if (name) {
          elementData.name = name;
        }
      }

      // Add class information for styling context
      const className = $element.attr('class');
      if (className) {
        elementData.class = className;
      }

      // Add id for identification
      const id = $element.attr('id');
      if (id) {
        elementData.id = id;
      }

      structuredData.push(elementData);
    });
  });

  return structuredData;
};

/**
 * Validates if content is within acceptable limits
 * 
 * @function validateContent
 * @param {string} content - Content to validate
 * @returns {boolean} - True if content is valid
 */
const validateContent = (content) => {
  if (!content || typeof content !== 'string') {
    return false;
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    logger.warn(`Content length ${content.length} exceeds maximum ${MAX_CONTENT_LENGTH}`);
    return false;
  }

  return true;
};

module.exports = {
  scrapeUrl,
  extractRawText,
  extractStructuredData,
  validateContent,
};
