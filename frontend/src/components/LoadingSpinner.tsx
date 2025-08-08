'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 53.04 81.36" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="loading-gradient" x1="-.04" y1="5.31" x2="54.76" y2="60.1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3ce5a7"/>
            <stop offset=".04" stopColor="#3adeab"/>
            <stop offset=".37" stopColor="#28a0ce"/>
            <stop offset=".65" stopColor="#1b73e8"/>
            <stop offset=".87" stopColor="#1357f9"/>
            <stop offset="1" stopColor="#114dff"/>
          </linearGradient>
        </defs>
        <g>
          <path 
            fill="url(#loading-gradient)" 
            d="M30.6,10.67h22.4s.04-.02.04-.04V.04s-.02-.04-.04-.04h-22.23C14.37,0,.48,12.83.01,29.22c-.11,4.04.58,7.91,1.92,11.46-1.25,3.3-1.93,6.87-1.93,10.6,0,16.59,13.5,30.09,30.09,30.09v-10.67c-10.08,0-18.38-7.72-19.32-17.56,5.22,4.39,11.95,7.04,19.28,7.05.02,0,.04-.02.04-.04v-10.59s-.02-.04-.04-.04c-6.78-.01-12.76-3.53-16.22-8.82,3.47-5.31,9.46-8.83,16.26-8.83h22.95v-10.67h-22.95c-7.34,0-14.08,2.65-19.3,7.03.98-9.96,9.68-17.54,19.82-17.54Z"
          />
        </g>
      </svg>
    </div>
  );
} 