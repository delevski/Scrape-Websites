/**
 * Logger Utility
 * Simple logging utility for development and production
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log levels
 */
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

/**
 * Base logger function
 * 
 * @function log
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 */
const log = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(data && { data }),
  };

  if (isDevelopment) {
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
  } else {
    console.log(JSON.stringify(logEntry));
  }
};

/**
 * Error level logging
 * 
 * @function error
 * @param {string} message - Error message
 * @param {any} data - Additional error data
 */
const error = (message, data = null) => {
  if (LOG_LEVELS.ERROR <= currentLogLevel) {
    log('ERROR', message, data);
  }
};

/**
 * Warning level logging
 * 
 * @function warn
 * @param {string} message - Warning message
 * @param {any} data - Additional warning data
 */
const warn = (message, data = null) => {
  if (LOG_LEVELS.WARN <= currentLogLevel) {
    log('WARN', message, data);
  }
};

/**
 * Info level logging
 * 
 * @function info
 * @param {string} message - Info message
 * @param {any} data - Additional info data
 */
const info = (message, data = null) => {
  if (LOG_LEVELS.INFO <= currentLogLevel) {
    log('INFO', message, data);
  }
};

/**
 * Debug level logging
 * 
 * @function debug
 * @param {string} message - Debug message
 * @param {any} data - Additional debug data
 */
const debug = (message, data = null) => {
  if (LOG_LEVELS.DEBUG <= currentLogLevel) {
    log('DEBUG', message, data);
  }
};

module.exports = {
  error,
  warn,
  info,
  debug,
};
