'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';

export default function DocumentUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedPost, setUploadedPost] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };
  
  // 处理文件上传
  const handleUpload = async () => {
    if (!file) {
      setError('请选择要上传的文档');
      return;
    }
    
    // 检查文件类型
    if (!file.name.endsWith('.docx')) {
      setError('仅支持.docx格式的Word文档');
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      setSuccess(null);
      
      // 创建FormData对象
      const formData = new FormData();
      formData.append('file', file);
      
      // 上传文档
      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传文档失败');
      }
      
      const data = await response.json();
      setUploadedPost(data.post);
      setSuccess(`文档已成功上传并转换为文章: ${data.post.title}`);
      
      // 重置文件输入
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('上传文档错误:', err);
      setError(err.message || '上传文档失败');
    } finally {
      setUploading(false);
    }
  };
  
  // 跳转到编辑页面
  const handleEdit = () => {
    if (uploadedPost && uploadedPost.id) {
      router.push(`/admin/posts/${uploadedPost.id}/edit`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">上传Word文档</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            上传Word文档(.docx)，系统将自动解析文档内容并创建新文章。
            上传后，您可以进一步编辑文章内容、添加分类和标签，然后发布。
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors dark:border-gray-600 dark:hover:border-indigo-400">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".docx"
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer block"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {file ? file.name : '点击选择文档或拖放文件到此处'}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  仅支持.docx格式的Word文档
                </p>
              </label>
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1"
              >
                {uploading ? '上传中...' : '上传并创建文章'}
              </Button>
              
              {uploadedPost && (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="flex-1"
                >
                  编辑新文章
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
