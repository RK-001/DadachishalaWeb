// Form validation utilities
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/; // Indian mobile number format
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

export const validatePositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

// File validation
export const validateFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeInMB = 10;
  
  return validateFileType(file, allowedTypes) && validateFileSize(file, maxSizeInMB);
};

// Sanitization utilities
export const sanitizeString = (str) => {
  if (!str) return '';
  return String(str)
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove inline event handlers
};

export const sanitizeEmail = (email) => {
  if (!email) return '';
  return String(email)
    .trim()
    .toLowerCase()
    .replace(/[^\w@.-]/g, ''); // Keep only valid email characters
};

export const sanitizePhone = (phone) => {
  if (!phone) return '';
  return String(phone).replace(/\D/g, ''); // Keep only digits
};

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

