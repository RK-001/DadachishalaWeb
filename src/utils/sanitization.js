// Sanitization utilities to prevent XSS and injection attacks

/**
 * Sanitize a string by removing potentially dangerous characters
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (str) => {
    if (!str) return '';
    return String(str)
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove inline event handlers
  };
  
  /**
   * Sanitize an email address
   * @param {string} email - The email to sanitize
   * @returns {string} - Sanitized email
   */
  export const sanitizeEmail = (email) => {
    if (!email) return '';
    return String(email)
      .trim()
      .toLowerCase()
      .replace(/[^\w@.-]/g, ''); // Keep only valid email characters
  };
  
  /**
   * Sanitize a phone number
   * @param {string} phone - The phone number to sanitize
   * @returns {string} - Sanitized phone number
   */
  export const sanitizePhone = (phone) => {
    if (!phone) return '';
    return String(phone).replace(/\D/g, ''); // Keep only digits
  };
  
  /**
   * Sanitize a URL
   * @param {string} url - The URL to sanitize
   * @returns {string} - Sanitized URL or empty string if invalid
   */
  export const sanitizeUrl = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        return urlObj.href;
      }
    } catch (e) {
      return '';
    }
    return '';
  };
  
  /**
   * Sanitize HTML content by escaping special characters
   * @param {string} html - The HTML string to sanitize
   * @returns {string} - Sanitized HTML
   */
  export const sanitizeHtml = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  };
  
  /**
   * Sanitize an object by applying sanitization to all string values
   * @param {Object} obj - The object to sanitize
   * @returns {Object} - Sanitized object
   */
  export const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'string') {
          sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  };
  
  /**
   * Sanitize form data
   * @param {FormData|Object} formData - The form data to sanitize
   * @returns {Object} - Sanitized form data object
   */
  export const sanitizeFormData = (formData) => {
    const sanitized = {};
    
    if (formData instanceof FormData) {
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          sanitized[key] = sanitizeString(value);
        } else {
          sanitized[key] = value;
        }
      }
    } else {
      return sanitizeObject(formData);
    }
    
    return sanitized;
  };
  