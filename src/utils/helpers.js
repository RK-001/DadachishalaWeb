// Date formatting utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Text utilities
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Branch timing formatting
export const formatTimings = (school_timings) => {
  if (!school_timings) return "Mon - Sat: 9:00 AM - 6:00 PM";
  
  const openDays = Object.entries(school_timings)
    .filter(([day, timing]) => timing.isOpen)
    .map(([day, timing]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1, 3),
      start: timing.start,
      end: timing.end
    }));
  
  if (openDays.length === 0) return "Closed";
  
  // Check if all open days have same timing
  const firstTiming = openDays[0];
  const allSameTiming = openDays.every(
    day => day.start === firstTiming.start && day.end === firstTiming.end
  );
  
  if (allSameTiming && openDays.length > 1) {
    const dayNames = openDays.map(d => d.day);
    const dayRange = dayNames.length === 6 && 
      dayNames.includes('Mon') && dayNames.includes('Sat') && 
      !dayNames.includes('Sun') ? 'Mon - Sat' : dayNames.join(', ');
    return `${dayRange}: ${firstTiming.start} - ${firstTiming.end}`;
  }
  
  return `${openDays.length} days open`;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// File utilities
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

// Local storage utilities
export const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};
