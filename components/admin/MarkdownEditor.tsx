'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

// 动态导入SimpleMDE编辑器，避免SSR问题
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ initialValue, onChange }: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef<any>(null);

  const handleChange = (value: string) => {
    setValue(value);
    onChange(value);
  };

  // 处理图片上传
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setUploading(true);

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
      return data.url;
    } catch (error) {
      console.error('上传图片失败:', error);
      return '';
    } finally {
      setUploading(false);
    }
  };

  // SimpleMDE编辑器选项
  const options = {
    autofocus: false,
    spellChecker: false,
    placeholder: '在这里输入Markdown内容...',
    status: ['lines', 'words', 'cursor'],
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      'table',
      'code',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
      'guide',
    ],
    uploadImage: true,
    imageUploadFunction: handleImageUpload,
  };

  return (
    <div className="markdown-editor relative">
      {uploading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-2 text-indigo-600">上传图片中...</p>
          </div>
        </div>
      )}
      <SimpleMDE
        value={value}
        onChange={handleChange}
        options={options}
        ref={editorRef}
      />
    </div>
  );
}
