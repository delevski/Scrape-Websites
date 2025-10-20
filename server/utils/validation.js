/**
 * Validation Utilities
 * Request validation middleware and functions
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

const Joi = require('joi');

/**
 * Validation schema for scrape requests
 */
const scrapeRequestSchema = Joi.object({
  url: Joi.string()
    .uri({
      scheme: ['http', 'https'],
    })
    .required()
    .messages({
      'string.uri': 'URL must be a valid HTTP or HTTPS URL',
      'any.required': 'URL is required',
      'string.empty': 'URL cannot be empty',
    }),
});

/**
 * Validation schema for export requests
 */
const exportRequestSchema = Joi.object({
  url: Joi.string()
    .uri({
      scheme: ['http', 'https'],
    })
    .required()
    .messages({
      'string.uri': 'URL must be a valid HTTP or HTTPS URL',
      'any.required': 'URL is required',
    }),
  structuredData: Joi.array()
    .items(
      Joi.object({
        tag: Joi.string().required(),
        text: Joi.string().required(),
        href: Joi.string().optional(),
        class: Joi.string().optional(),
        id: Joi.string().optional(),
        index: Joi.number().optional(),
      })
    )
    .required()
    .messages({
      'array.base': 'Structured data must be an array',
      'any.required': 'Structured data is required',
    }),
  rawText: Joi.string()
    .required()
    .messages({
      'string.base': 'Raw text must be a string',
      'any.required': 'Raw text is required',
    }),
  metadata: Joi.object({
    totalElements: Joi.number().required(),
    textLength: Joi.number().required(),
    uniqueTags: Joi.number().required(),
    processingTime: Joi.number().optional(),
  })
    .required()
    .messages({
      'object.base': 'Metadata must be an object',
      'any.required': 'Metadata is required',
    }),
});

/**
 * Middleware to validate scrape request data
 * 
 * @function validateScrapeRequest
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateScrapeRequest = (req, res, next) => {
  const { error, value } = scrapeRequestSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: errorDetails,
    });
  }

  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};

/**
 * Validates URL format using regex
 * 
 * @function isValidUrl
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitizes URL to prevent potential security issues
 * 
 * @function sanitizeUrl
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
const sanitizeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Remove potential security risks
    urlObj.hash = '';
    urlObj.search = '';
    
    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * Middleware to validate export request data
 * 
 * @function validateExportRequest
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateExportRequest = (req, res, next) => {
  const { error, value } = exportRequestSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid export request data',
      details: errorDetails,
    });
  }

  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};

module.exports = {
  validateScrapeRequest,
  validateExportRequest,
  isValidUrl,
  sanitizeUrl,
  scrapeRequestSchema,
  exportRequestSchema,
};
