/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

import React, { memo } from 'react';

const LoadingSpinner = memo(({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-600 ${sizes[size]}`} />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
