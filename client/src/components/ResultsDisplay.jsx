/**
 * Results Display Component
 * Displays scraping results in both raw text and structured table formats
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { FileText, Table, Search, Download, Copy, Check, Sheet } from 'lucide-react';
import { cn } from '../utils/cn';
import { exportToGoogleSheets } from '../services/api';

/**
 * Main results display component with tabs for raw text and structured data
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.results - Scraping results from the API
 * @returns {JSX.Element} - The results display component
 */
const ResultsDisplay = ({ results }) => {
  const [activeTab, setActiveTab] = useState('raw');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  // Memoized filtered structured data
  const filteredStructuredData = useMemo(() => {
    if (!searchTerm) return results.structuredData;
    
    return results.structuredData.filter(item => 
      item.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.href && item.href.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [results.structuredData, searchTerm]);

  /**
   * Copies text to clipboard
   * 
   * @function copyToClipboard
   * @param {string} text - Text to copy
   */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  /**
   * Downloads text as a file
   * 
   * @function downloadAsFile
   * @param {string} content - Content to download
   * @param {string} filename - Filename for the download
   * @param {string} type - MIME type for the file
   */
  const downloadAsFile = (content, filename, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Exports data to Google Sheets
   * 
   * @async
   * @function handleGoogleSheetsExport
   */
  const handleGoogleSheetsExport = async () => {
    setIsExporting(true);
    setExportStatus(null);

    try {
      const exportData = {
        url: results.url,
        structuredData: results.structuredData,
        rawText: results.rawText,
        metadata: results.metadata,
      };

      const result = await exportToGoogleSheets(exportData);
      
      setExportStatus({
        type: 'success',
        message: 'Data exported to Google Sheets successfully!',
        sheetUrl: result.data.sheetUrl,
      });

      // Auto-clear success message after 5 seconds
      setTimeout(() => setExportStatus(null), 5000);

    } catch (error) {
      setExportStatus({
        type: 'error',
        message: error.message || 'Failed to export to Google Sheets',
      });

      // Auto-clear error message after 5 seconds
      setTimeout(() => setExportStatus(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Formats file size for display
   * 
   * @function formatFileSize
   * @param {number} bytes - Size in bytes
   * @returns {string} - Formatted size string
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
          {/* Results Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Scraping Results
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Successfully scraped: <span className="font-mono text-blue-600 dark:text-blue-400">{results.url}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>⏱️ {results.processingTime}ms</span>
                <span>📊 {results.metadata.totalElements} elements</span>
              </div>
              <button
                onClick={handleGoogleSheetsExport}
                disabled={isExporting}
                className={cn(
                  "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md",
                  "text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
                  "disabled:bg-gray-400 disabled:cursor-not-allowed",
                  "btn-hover transition-all duration-200"
                )}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Sheet className="h-4 w-4 mr-2" />
                    Export to Google Sheets
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export Status Messages */}
          {exportStatus && (
            <div className={cn(
              "mb-4 p-3 rounded-md border",
              exportStatus.type === 'success' 
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {exportStatus.type === 'success' ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      <span className="font-medium">{exportStatus.message}</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">⚠️</span>
                      <span className="font-medium">{exportStatus.message}</span>
                    </>
                  )}
                </div>
                {exportStatus.sheetUrl && (
                  <a
                    href={exportStatus.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline font-medium"
                  >
                    Open Sheet →
                  </a>
                )}
                <button
                  onClick={() => setExportStatus(null)}
                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('raw')}
              className={cn(
                "flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === 'raw'
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              <FileText className="h-4 w-4 mr-2" />
              Raw Text ({formatFileSize(results.rawText.length)})
            </button>
            <button
              onClick={() => setActiveTab('structured')}
              className={cn(
                "flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === 'structured'
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              <Table className="h-4 w-4 mr-2" />
              Structured Data ({results.metadata.totalElements})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'raw' ? (
        <RawTextView 
          rawText={results.rawText}
          onCopy={copyToClipboard}
          onDownload={downloadAsFile}
          copied={copied}
        />
      ) : (
        <StructuredTableView
          structuredData={filteredStructuredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCopy={copyToClipboard}
          onDownload={downloadAsFile}
          copied={copied}
        />
      )}
    </div>
  );
};

/**
 * Raw text view component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.rawText - Raw text content
 * @param {Function} props.onCopy - Copy callback function
 * @param {Function} props.onDownload - Download callback function
 * @param {boolean} props.copied - Copy state indicator
 * @returns {JSX.Element} - The raw text view component
 */
const RawTextView = ({ rawText, onCopy, onDownload, copied }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Raw Extracted Text
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onCopy(rawText)}
            className={cn(
              "inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium",
              "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={() => onDownload(rawText, 'scraped-text.txt', 'text/plain')}
            className={cn(
              "inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium",
              "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 max-h-96 overflow-y-auto results-scroll">
          {rawText}
        </pre>
      </div>
    </div>
  </div>
);

/**
 * Structured table view component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.structuredData - Structured data array
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Search change callback
 * @param {Function} props.onCopy - Copy callback function
 * @param {Function} props.onDownload - Download callback function
 * @param {boolean} props.copied - Copy state indicator
 * @returns {JSX.Element} - The structured table view component
 */
const StructuredTableView = ({ structuredData, searchTerm, onSearchChange, onCopy, onDownload, copied }) => {
  const exportAsJSON = () => {
    const jsonData = JSON.stringify(structuredData, null, 2);
    onDownload(jsonData, 'structured-data.json', 'application/json');
  };

  const exportAsCSV = () => {
    const headers = ['Index', 'Tag', 'Text', 'Href', 'Class', 'ID'];
    const csvRows = [headers.join(',')];
    
    structuredData.forEach(item => {
      const row = [
        item.index,
        `"${item.tag}"`,
        `"${(item.text || '').replace(/"/g, '""')}"`,
        `"${item.href || ''}"`,
        `"${item.class || ''}"`,
        `"${item.id || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    onDownload(csvRows.join('\n'), 'structured-data.csv', 'text/csv');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Structured Data Table
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onCopy(JSON.stringify(structuredData, null, 2))}
              className={cn(
                "inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium",
                "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </>
              )}
            </button>
            <button
              onClick={exportAsJSON}
              className={cn(
                "inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium",
                "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </button>
            <button
              onClick={exportAsCSV}
              className={cn(
                "inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium",
                "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by tag, text, or href..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {structuredData.length} elements
          {searchTerm && ` (filtered from ${structuredData.length} total)`}
        </div>

        {/* Table */}
        <div className="overflow-x-auto table-responsive">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Text Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Href
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Class
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {structuredData.map((item, index) => (
                <tr key={item.index || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.index || index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {item.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 max-w-xs">
                    <div className="truncate" title={item.text}>
                      {item.text}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {item.href ? (
                      <a 
                        href={item.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
                        title={item.href}
                      >
                        {item.href}
                      </a>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {item.class ? (
                      <span className="truncate block max-w-xs" title={item.class}>
                        {item.class}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {structuredData.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No elements match your search criteria.' : 'No structured data found.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
