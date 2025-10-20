/**
 * Export Routes
 * Handles data export functionality including Google Sheets
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

const express = require('express');
const { exportToGoogleSheets, getExportStatus } = require('../controllers/exportController');
const { validateExportRequest } = require('../utils/validation');

const router = express.Router();

/**
 * POST /api/export/google-sheets
 * Exports scraped data to Google Sheets
 * 
 * @route POST /api/export/google-sheets
 * @param {Object} req.body - Request body containing scraping data
 * @param {string} req.body.url - The original scraped URL
 * @param {Array} req.body.structuredData - Structured data array
 * @param {string} req.body.rawText - Raw text content
 * @param {Object} req.body.metadata - Scraping metadata
 * @returns {Object} 200 - Export result with Google Sheets URL
 * @returns {Object} 400 - Invalid request data
 * @returns {Object} 500 - Server error during export
 */
router.post('/google-sheets', validateExportRequest, exportToGoogleSheets);

/**
 * GET /api/export/status
 * Gets the status of export services
 * 
 * @route GET /api/export/status
 * @returns {Object} 200 - Export services status
 */
router.get('/status', getExportStatus);

module.exports = router;
