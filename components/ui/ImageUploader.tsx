'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
  className?: string;
}

export default function ImageUploader({ onUpload, defaultImage, className = '' }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      // 创建FormData
      const formData = new FormData();
      formData.append('file', file);

      // 发送上传请求
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const data = await response.json();
      setImage(data.url);
      onUpload(data.url);
    } catch (err: any) {
      setError(err.message);
      console.error('上传图片失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 触发文件选择对话框
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 移除图片
  const handleRemoveImage = () => {
    setImage(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          图片上传
        </label>
        {image && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            移除图片
          </button>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className="hidden"
      />

      {/* 上传区域 */}
      {!image ? (
        <div
          onClick={handleButtonClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {loading ? '上传中...' : '点击上传图片'}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            支持 JPG, PNG, GIF, WebP, SVG 格式，最大 5MB
          </p>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <Image
            src={image}
            alt="Uploaded image"
            width={300}
            height={200}
            className="w-full h-auto object-cover"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="absolute bottom-2 right-2 bg-white bg-opacity-75 rounded-full p-2 shadow-md hover:bg-opacity-100"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
