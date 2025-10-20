/**
 * Export Controller
 * Handles data export operations including Google Sheets
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

const googleSheetsService = require('../services/googleSheetsService');
const logger = require('../utils/logger');

/**
 * Exports scraped data to Google Sheets
 * 
 * @async
 * @function exportToGoogleSheets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const exportToGoogleSheets = async (req, res, next) => {
  try {
    const { url, structuredData, rawText, metadata } = req.body;
    
    logger.info(`Starting Google Sheets export for URL: ${url}`);
    
    // Validate required data
    if (!url || !structuredData || !rawText || !metadata) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'URL, structuredData, rawText, and metadata are required for export',
      });
    }

    // Check if Google Sheets service is available
    if (!googleSheetsService.isAvailable()) {
      return res.status(503).json({
        error: 'Google Sheets export not available',
        message: 'Google Sheets service is not configured. Please contact administrator.',
      });
    }

    // Prepare data for export
    const scrapeData = {
      url,
      structuredData,
      rawText,
      metadata,
    };

    // Export to Google Sheets
    const startTime = Date.now();
    const result = await googleSheetsService.exportToSheets(scrapeData);
    const endTime = Date.now();

    logger.info(`Google Sheets export completed in ${endTime - startTime}ms for URL: ${url}`);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Data exported to Google Sheets successfully',
      data: {
        ...result,
        exportTime: endTime - startTime,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error(`Google Sheets export error for URL ${req.body.url}:`, error);
    
    // Handle specific error types
    if (error.message.includes('not configured')) {
      return res.status(503).json({
        error: 'Service Not Configured',
        message: 'Google Sheets export service is not properly configured.',
      });
    }

    if (error.message.includes('permission') || error.message.includes('auth')) {
      return res.status(403).json({
        error: 'Authentication Error',
        message: 'Failed to authenticate with Google Sheets API. Please check credentials.',
      });
    }

    if (error.message.includes('quota') || error.message.includes('limit')) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'Google Sheets API rate limit exceeded. Please try again later.',
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Export Failed',
      message: 'An unexpected error occurred while exporting to Google Sheets. Please try again later.',
    });
  }
};

/**
 * Gets the status of export services
 * 
 * @async
 * @function getExportStatus
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const getExportStatus = async (req, res, next) => {
  try {
    const status = {
      googleSheets: {
        available: googleSheetsService.isAvailable(),
        configured: googleSheetsService.isAvailable(),
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: status,
    });

  } catch (error) {
    logger.error('Failed to get export status:', error);
    res.status(500).json({
      error: 'Status Check Failed',
      message: 'Failed to check export service status.',
    });
  }
};

module.exports = {
  exportToGoogleSheets,
  getExportStatus,
};
