/**
 * Loading Spinner Component
 * Animated loading indicator for scraping operations
 * 
 * @author Senior Full-Stack Developer
 * @version 1.0.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading spinner component with customizable size and message
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - The loading spinner component
 */
const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "md", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
      <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
