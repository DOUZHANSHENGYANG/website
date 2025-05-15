'use client';

import React, { useState, useEffect } from 'react';
import { Tag } from '@/types';

export default function TagsAdminPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 表单状态
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  
  // 获取标签列表
  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tags');
      
      if (!response.ok) {
        throw new Error('获取标签列表失败');
      }
      
      const data = await response.json();
      setTags(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchTags();
  }, []);
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // 生成slug
  const generateSlug = () => {
    if (!formData.name) return;
    
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData((prev) => ({ ...prev, slug }));
  };
  
  // 重置表单
  const resetForm = () => {
    setFormMode('create');
    setEditingId(null);
    setFormData({
      name: '',
      slug: ''
    });
  };
  
  // 编辑标签
  const handleEdit = (tag: Tag) => {
    setFormMode('edit');
    setEditingId(tag.id);
    setFormData({
      name: tag.name,
      slug: tag.slug
    });
  };
  
  // 删除标签
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个标签吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除标签失败');
      }
      
      setSuccess('标签删除成功');
      fetchTags();
      
      // 如果正在编辑被删除的标签，重置表单
      if (editingId === id) {
        resetForm();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setSuccess(null);
      
      // 验证必填字段
      if (!formData.name) {
        throw new Error('标签名称是必填字段');
      }
      
      const url = formMode === 'edit' && editingId
        ? `/api/tags/${editingId}`
        : '/api/tags';
      
      const method = formMode === 'edit' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存标签失败');
      }
      
      setSuccess(formMode === 'edit' ? '标签更新成功' : '标签创建成功');
      fetchTags();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">标签管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 标签表单 */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {formMode === 'edit' ? '编辑标签' : '创建新标签'}
            </h2>
            
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {/* 成功提示 */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  标签名称 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="bg-gray-200 px-4 py-2 rounded-r-md hover:bg-gray-300"
                  >
                    生成
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                {formMode === 'edit' && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {formMode === 'edit' ? '更新标签' : '创建标签'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* 标签列表 */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">标签列表</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : tags.length === 0 ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p className="text-gray-500">暂无标签</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{tag.name}</h3>
                        <p className="text-sm text-gray-500">{tag.slug}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(tag)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
