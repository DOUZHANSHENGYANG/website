'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = '',
}: LoadingSpinnerProps) {
  // 尺寸映射
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };
  
  // 颜色映射
  const colorMap = {
    primary: 'border-indigo-500',
    secondary: 'border-gray-500',
    white: 'border-white',
  };
  
  return (
    <div className={`${className} flex justify-center items-center`}>
      <div
        className={`${sizeMap[size]} ${colorMap[color]} animate-spin rounded-full border-t-transparent`}
      />
    </div>
  );
}
