/**
 * Google Sheets Export Service
 * Handles exporting scraped data to Google Sheets
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

const { google } = require('googleapis');
const logger = require('../utils/logger');

/**
 * Google Sheets service for exporting scraped data
 */
class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.isConfigured = this.initializeAuth();
  }

  /**
   * Initialize Google Sheets authentication
   * 
   * @async
   * @function initializeAuth
   * @returns {Promise<boolean>} - True if configured, false otherwise
   */
  async initializeAuth() {
    try {
      // Ensure environment variables are loaded
      require('dotenv').config();
      
      // Check if service account credentials are available
      let credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

      logger.info('Spreadsheet ID from env:', spreadsheetId);

      // Set the spreadsheet ID from the shared link
      if (!spreadsheetId) {
        // Extract ID from the shared link
        this.spreadsheetId = '19HR93NB-D2JJSqDxYkG5WzDIo2L-N_nrQSnotV3imgU';
        logger.info('Using demo Google Sheets configuration');
        return true;
      }

      this.spreadsheetId = spreadsheetId;

      // Try to read from credentials file first (more reliable than env var)
      try {
        const fs = require('fs');
        const path = require('path');
        const credentialsPath = path.join(__dirname, '..', 'credentials.json');
        if (fs.existsSync(credentialsPath)) {
          credentials = fs.readFileSync(credentialsPath, 'utf8');
          logger.info('Loaded credentials from file');
        }
      } catch (error) {
        logger.warn('Could not read credentials file:', error.message);
      }

      if (!credentials) {
        logger.warn('Google Sheets not configured - missing credentials, using demo mode');
        return false;
      }

      // Parse service account credentials
      const serviceAccountCredentials = JSON.parse(credentials);
      
      // Create JWT auth client
      this.auth = new google.auth.JWT({
        email: serviceAccountCredentials.client_email,
        key: serviceAccountCredentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      // Authorize the client
      try {
        await this.auth.authorize();
        logger.info('JWT authentication successful');
      } catch (authError) {
        logger.error('JWT authentication failed:', authError.message);
        throw authError;
      }

      // Initialize sheets API
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });

      logger.info('Google Sheets service initialized successfully');
      logger.info('Auth client created:', !!this.auth);
      logger.info('Sheets API initialized:', !!this.sheets);
      return true;

    } catch (error) {
      logger.error('Failed to initialize Google Sheets service:', error);
      return false;
    }
  }

  /**
   * Export scraped data to Google Sheets
   * 
   * @async
   * @function exportToSheets
   * @param {Object} scrapeData - Scraped data to export
   * @param {string} scrapeData.url - Source URL
   * @param {Array} scrapeData.structuredData - Structured data array
   * @param {string} scrapeData.rawText - Raw text content
   * @param {Object} scrapeData.metadata - Scraping metadata
   * @returns {Promise<Object>} - Export result with sheet URL
   */
  async exportToSheets(scrapeData) {
    try {
      if (!this.isConfigured) {
        throw new Error('Google Sheets service not configured');
      }

      const spreadsheetId = this.spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID || '19HR93NB-D2JJSqDxYkG5WzDIo2L-N_nrQSnotV3imgU';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sheetName = `Scrape_${timestamp}`;

      // Prepare data for export
      const exportData = this.prepareExportData(scrapeData);

      // If no auth is configured, return demo response
      if (!this.auth || !this.sheets) {
        logger.info('Demo mode: Google Sheets export would create new sheet with scraped data');
        logger.info('Auth available:', !!this.auth);
        logger.info('Sheets API available:', !!this.sheets);
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        
        return {
          success: true,
          sheetUrl,
          sheetName,
          exportedRows: exportData.structuredData.length,
          demo: true,
          message: 'Demo mode - data ready for export. Configure Google service account for actual export.',
        };
      }

      // Create new sheet
      await this.createNewSheet(spreadsheetId, sheetName);

      // Add header row
      await this.addHeaderRow(spreadsheetId, sheetName);

      // Add scraped data
      await this.addDataRows(spreadsheetId, sheetName, exportData.structuredData);

      // Add metadata sheet
      await this.addMetadataSheet(spreadsheetId, exportData.metadata, scrapeData.url, timestamp);

      const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`;

      logger.info(`Data exported to Google Sheets: ${sheetUrl}`);

      return {
        success: true,
        sheetUrl,
        sheetName,
        exportedRows: exportData.structuredData.length,
      };

    } catch (error) {
      logger.error('Failed to export to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Prepare data for export
   * 
   * @function prepareExportData
   * @param {Object} scrapeData - Raw scrape data
   * @returns {Object} - Formatted export data
   */
  prepareExportData(scrapeData) {
    const { structuredData, metadata } = scrapeData;

    // Format structured data for export
    const formattedData = structuredData.map((item, index) => [
      index + 1,
      item.tag || '',
      item.text || '',
      item.href || '',
      item.class || '',
      item.id || '',
      item.src || '',
      item.alt || '',
      item.type || '',
      item.name || '',
    ]);

    return {
      structuredData: formattedData,
      metadata: {
        ...metadata,
        exportTimestamp: new Date().toISOString(),
        sourceUrl: scrapeData.url,
      },
    };
  }

  /**
   * Create a new sheet in the spreadsheet
   * 
   * @async
   * @function createNewSheet
   * @param {string} spreadsheetId - Google Sheets ID
   * @param {string} sheetName - Name for the new sheet
   */
  async createNewSheet(spreadsheetId, sheetName) {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      logger.error('Failed to create new sheet:', error);
      throw error;
    }
  }

  /**
   * Add header row to the sheet
   * 
   * @async
   * @function addHeaderRow
   * @param {string} spreadsheetId - Google Sheets ID
   * @param {string} sheetName - Sheet name
   */
  async addHeaderRow(spreadsheetId, sheetName) {
    const headers = [
      'Index',
      'HTML Tag',
      'Text Content',
      'Href/Link',
      'CSS Class',
      'Element ID',
      'Image Src',
      'Image Alt',
      'Input Type',
      'Input Name',
    ];

    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:J1`,
      valueInputOption: 'RAW',
      resource: {
        values: [headers],
      },
    });

    // Format header row
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: await this.getSheetId(spreadsheetId, sheetName),
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.2, green: 0.6, blue: 0.9 },
                  textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
        ],
      },
    });
  }

  /**
   * Add data rows to the sheet
   * 
   * @async
   * @function addDataRows
   * @param {string} spreadsheetId - Google Sheets ID
   * @param {string} sheetName - Sheet name
   * @param {Array} data - Data rows to add
   */
  async addDataRows(spreadsheetId, sheetName, data) {
    if (data.length === 0) return;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A2:J${data.length + 1}`,
      valueInputOption: 'RAW',
      resource: {
        values: data,
      },
    });

    // Auto-resize columns
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: await this.getSheetId(spreadsheetId, sheetName),
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 10,
              },
            },
          },
        ],
      },
    });
  }

  /**
   * Add metadata sheet with scraping information
   * 
   * @async
   * @function addMetadataSheet
   * @param {string} spreadsheetId - Google Sheets ID
   * @param {Object} metadata - Scraping metadata
   * @param {string} sourceUrl - Original URL that was scraped
   * @param {string} timestamp - Export timestamp
   */
  async addMetadataSheet(spreadsheetId, metadata, sourceUrl, timestamp) {
    const metadataSheetName = 'Scraping_Info';

    try {
      // Create metadata sheet
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: metadataSheetName,
                },
              },
            },
          ],
        },
      });

      // Add metadata content
      const metadataData = [
        ['Scraping Information', ''],
        ['Source URL', sourceUrl],
        ['Export Timestamp', timestamp],
        ['Total Elements', metadata.totalElements],
        ['Text Length', metadata.textLength],
        ['Unique Tags', metadata.uniqueTags],
        ['Processing Time (ms)', metadata.processingTime],
        ['', ''],
        ['Tag Distribution', ''],
        ...Object.entries(this.getTagDistribution(metadata)),
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${metadataSheetName}!A1:B${metadataData.length}`,
        valueInputOption: 'RAW',
        resource: {
          values: metadataData,
        },
      });

    } catch (error) {
      logger.error('Failed to add metadata sheet:', error);
      // Don't throw error for metadata sheet failure
    }
  }

  /**
   * Get sheet ID by name
   * 
   * @async
   * @function getSheetId
   * @param {string} spreadsheetId - Google Sheets ID
   * @param {string} sheetName - Sheet name
   * @returns {Promise<number>} - Sheet ID
   */
  async getSheetId(spreadsheetId, sheetName) {
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheet = response.data.sheets.find(s => s.properties.title === sheetName);
    return sheet ? sheet.properties.sheetId : 0;
  }

  /**
   * Get tag distribution from metadata
   * 
   * @function getTagDistribution
   * @param {Object} metadata - Scraping metadata
   * @returns {Object} - Tag distribution object
   */
  getTagDistribution(metadata) {
    // This would need to be enhanced to track actual tag counts
    // For now, return a placeholder
    return {
      'HTML Tags Found': metadata.uniqueTags,
      'Total Elements': metadata.totalElements,
    };
  }

  /**
   * Check if Google Sheets export is available
   * 
   * @function isAvailable
   * @returns {boolean} - True if available, false otherwise
   */
  isAvailable() {
    return this.isConfigured;
  }
}

// Export singleton instance
module.exports = new GoogleSheetsService();
