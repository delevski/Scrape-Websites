/**
 * Scrape Form Component
 * Handles URL input and form submission for web scraping
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

import React, { useState, useRef } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { cn } from '../utils/cn';
import { isValidUrl as validateUrl } from '../services/api';

/**
 * Form component for URL input and scraping initiation
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onScrape - Callback function when scrape is initiated
 * @param {Function} props.onReset - Callback function to reset the form
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {boolean} props.disabled - Disabled state for form inputs
 * @returns {JSX.Element} - The scrape form component
 */
const ScrapeForm = ({ onScrape, onReset, isLoading, disabled }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  /**
   * Validates the input URL and sets error state
   * 
   * @function validateUrlInput
   * @param {string} inputUrl - URL to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateUrlInput = (inputUrl) => {
    if (!inputUrl.trim()) {
      setError('Please enter a URL');
      return false;
    }

    if (!validateUrl(inputUrl)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return false;
    }

    setError('');
    return true;
  };

  /**
   * Handles form submission
   * 
   * @function handleSubmit
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateUrlInput(url)) {
      onScrape(url.trim());
    }
  };

  /**
   * Handles URL input change
   * 
   * @function handleUrlChange
   * @param {Event} e - Input change event
   */
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  /**
   * Handles form reset
   * 
   * @function handleReset
   */
  const handleReset = () => {
    setUrl('');
    setError('');
    onReset();
    inputRef.current?.focus();
  };

  /**
   * Handles Enter key press in input
   * 
   * @function handleKeyPress
   * @param {Event} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Website URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            id="url-input"
            type="url"
            value={url}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com"
            disabled={disabled}
            className={cn(
              "block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm",
              "text-sm placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              "dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400",
              "dark:focus:ring-blue-400 dark:focus:border-blue-400",
              error 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600" 
                : "border-gray-300 dark:border-gray-600"
            )}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={disabled || !url.trim() || !!error}
          className={cn(
            "flex-1 inline-flex items-center justify-center px-6 py-3",
            "border border-transparent text-base font-medium rounded-lg",
            "text-white bg-blue-600 hover:bg-blue-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            "disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500",
            "dark:focus:ring-offset-gray-800",
            "btn-hover transition-all duration-200"
          )}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Scraping...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Scrape Website
            </>
          )}
        </button>

        {(url || isLoading) && (
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            className={cn(
              "inline-flex items-center justify-center px-4 py-3",
              "border border-gray-300 text-base font-medium rounded-lg",
              "text-gray-700 bg-white hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400",
              "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600",
              "dark:focus:ring-offset-gray-800",
              "btn-hover transition-all duration-200"
            )}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Reset</span>
          </button>
        )}
      </div>

      {/* Help text */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>💡 Tip: Enter any valid website URL to extract its content and structure</p>
        <p>Examples: https://example.com, https://news.ycombinator.com, https://github.com</p>
      </div>
    </form>
  );
};

export default ScrapeForm;
