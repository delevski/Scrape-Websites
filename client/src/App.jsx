/**
 * Main App Component
 * Production-grade web scraping application with modern React patterns
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import { Globe, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import ScrapeForm from './components/ScrapeForm';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { scrapeWebsite } from './services/api';
import './App.css';

/**
 * Main application component
 * Manages application state and coordinates between child components
 * 
 * @component
 * @returns {JSX.Element} - The main app component
 */
function App() {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [serverStatus, setServerStatus] = useState('unknown');

  /**
   * Handles the scraping process
   * 
   * @async
   * @function handleScrape
   * @param {string} url - The URL to scrape
   */
  const handleScrape = useCallback(async (url) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log(`🚀 Starting scrape process for: ${url}`);
      
      const response = await scrapeWebsite(url);
      
      console.log('✅ Scrape completed successfully:', response);
      setResults(response.data);
      
    } catch (err) {
      console.error('❌ Scrape failed:', err);
      setError({
        message: err.message,
        type: 'scrape_error',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Resets the application state
   * 
   * @function handleReset
   */
  const handleReset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Web Scraper
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Production-Grade Scraping Tool
                </p>
              </div>
            </div>
            
            {/* Server Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                serverStatus === 'healthy' ? 'bg-green-500' : 
                serverStatus === 'unhealthy' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Server {serverStatus}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Scrape Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Enter Website URL
              </h2>
              <ScrapeForm 
                onScrape={handleScrape}
                onReset={handleReset}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-8 text-center">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Scraping website content...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <ErrorMessage 
                  error={error}
                  onDismiss={() => setError(null)}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {results && !isLoading && (
            <div className="animate-fade-in">
              <ResultsDisplay results={results} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Built with React, Node.js, and Express • 
              Powered by Cheerio for web scraping
            </p>
            <p className="mt-1">
              Production-ready architecture with comprehensive error handling
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
