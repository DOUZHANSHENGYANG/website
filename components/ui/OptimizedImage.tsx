'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  aspectRatio?: string;
  wrapperClassName?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.svg',
  aspectRatio = '16/9',
  wrapperClassName,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  // 处理图片加载错误
  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };
  
  // 确保alt文本存在
  const imageAlt = alt || '图片';
  
  // 确定实际显示的图片源
  const imageSrc = error ? fallbackSrc : src;
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-800',
        wrapperClassName
      )}
      style={{ aspectRatio }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={imageAlt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
