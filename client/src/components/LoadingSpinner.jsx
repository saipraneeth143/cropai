import React from 'react';
import { Sprout } from 'lucide-react';

const sizeClasses = {
  sm: 'h-5 w-5 border-2',
  md: 'h-9 w-9 border-[3px]',
  lg: 'h-14 w-14 border-4',
};

const containerSizeClasses = {
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-16',
};

export default function LoadingSpinner({ size = 'md', message, fullScreen = false }) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${containerSizeClasses[size]}`}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-primary-900/50 border-t-primary-500 animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {/* Icon in center (only for large) */}
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sprout className="h-5 w-5 text-primary-500 animate-pulse" />
          </div>
        )}
      </div>
      {message && (
        <p className="text-sm font-medium text-gray-400 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="card p-8 text-center">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
