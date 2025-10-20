/**
 * Error Message Component
 * Displays error messages with dismiss functionality
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * Error message component with dismiss functionality
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.error - Error object containing message and type
 * @param {Function} props.onDismiss - Callback function to dismiss the error
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - The error message component
 */
const ErrorMessage = ({ error, onDismiss, className = "" }) => {
  if (!error) return null;

  const getErrorIcon = () => {
    switch (error.type) {
      case 'network_error':
        return '🌐';
      case 'timeout_error':
        return '⏱️';
      case 'validation_error':
        return '📝';
      case 'scrape_error':
        return '🔍';
      default:
        return '⚠️';
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network_error':
        return 'Network Error';
      case 'timeout_error':
        return 'Request Timeout';
      case 'validation_error':
        return 'Validation Error';
      case 'scrape_error':
        return 'Scraping Failed';
      default:
        return 'Error';
    }
  };

  return (
    <div className={cn(
      "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4",
      className
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              <span className="mr-2">{getErrorIcon()}</span>
              {getErrorTitle()}
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-3 inline-flex rounded-md bg-red-50 dark:bg-red-900/20 p-1.5 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-red-900/20"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-2">
            <p className="text-sm text-red-700 dark:text-red-300">
              {error.message}
            </p>
            
            {/* Additional error details */}
            {error.details && (
              <div className="mt-3">
                <details className="text-sm">
                  <summary className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                    Show details
                  </summary>
                  <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                    <pre className="whitespace-pre-wrap text-xs text-red-800 dark:text-red-200">
                      {typeof error.details === 'string' 
                        ? error.details 
                        : JSON.stringify(error.details, null, 2)
                      }
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
