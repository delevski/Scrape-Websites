# Contributing to Web Scraper

Thank you for your interest in contributing to the Web Scraper project! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Google Cloud Project (for testing Google Sheets integration)

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/web-scraper.git
   cd web-scraper
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   cd client && npm install && cd ..
   ```

3. **Set Up Environment Variables**
   ```bash
   cp server/env.example server/.env
   cp client/env.example client/.env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Process

### Branch Naming

Use descriptive branch names:
- `feature/add-new-scraping-method`
- `fix/google-sheets-authentication`
- `docs/update-api-documentation`
- `refactor/improve-error-handling`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(scraper): add support for dynamic content scraping
fix(api): resolve Google Sheets authentication issue
docs(readme): update installation instructions
```

## Pull Request Process

### Before Submitting

1. **Update Documentation**
   - Update README.md if needed
   - Add/update API documentation
   - Include code comments for complex logic

2. **Test Your Changes**
   - Run the application locally
   - Test all affected functionality
   - Verify error handling works correctly

3. **Check Code Quality**
   - Run linting: `npm run lint`
   - Ensure code follows project standards
   - Remove console.log statements

### Submitting a Pull Request

1. **Create Pull Request**
   - Use descriptive title
   - Provide detailed description
   - Reference related issues

2. **Pull Request Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring
   - [ ] Performance improvement

   ## Testing
   - [ ] Tested locally
   - [ ] Added new tests
   - [ ] Updated existing tests

   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

3. **Review Process**
   - Address reviewer feedback
   - Make requested changes
   - Respond to comments

## Coding Standards

### JavaScript/Node.js

**Style Guidelines:**
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use const/let instead of var
- Use meaningful variable names

**Example:**
```javascript
const scraperService = require('../services/scraperService');
const logger = require('../utils/logger');

async function scrapeWebsite(url) {
  try {
    const result = await scraperService.scrape(url);
    logger.info(`Successfully scraped ${url}`);
    return result;
  } catch (error) {
    logger.error(`Failed to scrape ${url}:`, error);
    throw error;
  }
}
```

### React/JSX

**Component Guidelines:**
- Use functional components with hooks
- Use descriptive component names
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking

**Example:**
```jsx
import React, { useState, useEffect } from 'react';
import { scrapeWebsite } from '../services/api';

const ScrapeForm = ({ onScrape }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await scrapeWebsite(url);
      onScrape(result);
    } catch (error) {
      console.error('Scraping failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
};

export default ScrapeForm;
```

### CSS/Styling

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Use consistent spacing and colors
- Avoid inline styles

## Testing

### Backend Testing

```javascript
// Example test structure
describe('ScraperService', () => {
  it('should scrape a valid website', async () => {
    const url = 'https://example.com';
    const result = await scraperService.scrape(url);
    
    expect(result).toBeDefined();
    expect(result.url).toBe(url);
    expect(result.structuredData).toBeInstanceOf(Array);
  });

  it('should handle invalid URLs', async () => {
    const invalidUrl = 'not-a-valid-url';
    
    await expect(scraperService.scrape(invalidUrl))
      .rejects.toThrow('Invalid URL');
  });
});
```

### Frontend Testing

```javascript
// Example component test
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScrapeForm from '../ScrapeForm';

describe('ScrapeForm', () => {
  it('should submit form with valid URL', async () => {
    const mockOnScrape = jest.fn();
    render(<ScrapeForm onScrape={mockOnScrape} />);
    
    const input = screen.getByPlaceholderText('Enter URL');
    const button = screen.getByText('Scrape');
    
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnScrape).toHaveBeenCalled();
    });
  });
});
```

## Documentation

### Code Documentation

**JSDoc Comments:**
```javascript
/**
 * Scrapes a website and extracts structured data
 * @async
 * @function scrapeWebsite
 * @param {string} url - The URL to scrape
 * @param {Object} options - Scraping options
 * @param {number} options.timeout - Request timeout in milliseconds
 * @param {boolean} options.includeImages - Whether to include image URLs
 * @returns {Promise<Object>} Scraped data with structured content
 * @throws {Error} When URL is invalid or scraping fails
 */
async function scrapeWebsite(url, options = {}) {
  // Implementation
}
```

### README Updates

When adding new features:
- Update the Features section
- Add installation instructions if needed
- Update usage examples
- Include configuration options

### API Documentation

Keep API.md updated with:
- New endpoints
- Parameter changes
- Response format updates
- Error handling changes

## Issue Reporting

### Bug Reports

**Template:**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome, Firefox, Safari]
- Application version: [e.g., 1.0.0]

## Additional Context
Any other context about the problem
```

### Feature Requests

**Template:**
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why would this feature be useful?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other context or screenshots
```

## Development Guidelines

### Performance

- Optimize for large datasets
- Implement proper caching
- Use efficient algorithms
- Monitor memory usage

### Security

- Validate all inputs
- Sanitize user data
- Use environment variables for secrets
- Implement rate limiting

### Accessibility

- Use semantic HTML
- Include alt text for images
- Ensure keyboard navigation
- Test with screen readers

## Release Process

### Version Numbering

Follow semantic versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Test all functionality
- [ ] Update documentation
- [ ] Create release notes
- [ ] Tag release in Git

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request Reviews**: Code feedback and suggestions

### Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the Web Scraper project! 🚀
