/**
 * Scraping Routes
 * Handles all scraping-related API endpoints
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

const express = require('express');
const { scrapeWebsite } = require('../controllers/scrapeController');
const { validateScrapeRequest } = require('../utils/validation');

const router = express.Router();

/**
 * POST /api/scrape
 * Scrapes a website and returns both raw text and structured data
 * 
 * @route POST /api/scrape
 * @param {Object} req.body - Request body containing URL
 * @param {string} req.body.url - The website URL to scrape
 * @returns {Object} 200 - Scraping results with raw text and structured data
 * @returns {Object} 400 - Invalid request data
 * @returns {Object} 500 - Server error during scraping
 */
router.post('/scrape', validateScrapeRequest, scrapeWebsite);

module.exports = router;
