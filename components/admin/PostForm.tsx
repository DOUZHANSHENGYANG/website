'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Post, Category, Tag } from '@/types';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import ImageUploader from '@/components/ui/ImageUploader';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

interface PostFormProps {
  initialData?: Partial<Post>;
  isEditing?: boolean;
}

export default function PostForm({ initialData = {}, isEditing = false }: PostFormProps) {
  const router = useRouter();

  // 表单状态
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    published: false,
    featured: false,
    ...initialData,
  });

  // 分类和标签
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData.categories?.map((c) => c.id) || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData.tags?.map((t) => t.id) || []
  );

  // 预览模式
  const [previewMode, setPreviewMode] = useState(false);

  // 加载状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 获取分类和标签
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        // 获取分类
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('获取分类失败');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data);

        // 获取标签
        const tagsResponse = await fetch('/api/tags');
        if (!tagsResponse.ok) {
          throw new Error('获取标签失败');
        }
        const tagsData = await tagsResponse.json();
        setTags(tagsData.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCategoriesAndTags();
  }, []);

  // 处理输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 处理复选框变化
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // 处理分类变化
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 处理标签变化
  const handleTagChange = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // 生成slug
  const generateSlug = () => {
    if (!formData.title) return;

    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({ ...prev, slug }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // 验证必填字段
      if (!formData.title || !formData.content) {
        throw new Error('标题和内容是必填字段');
      }

      // 准备提交数据
      const postData = {
        ...formData,
        categories: selectedCategories,
        tags: selectedTags,
        authorId: initialData.authorId || 'user1', // 临时使用固定作者ID
      };

      // 发送请求
      const url = isEditing
        ? `/api/posts/${initialData.id}`
        : '/api/posts';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存文章失败');
      }

      const savedPost = await response.json();

      setSuccess('文章保存成功！');

      // 如果是新建文章，跳转到编辑页面
      if (!isEditing) {
        router.push(`/admin/posts/${savedPost.id}/edit`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? '编辑文章' : '创建新文章'}
      </h1>

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

      <div className="flex flex-col lg:flex-row gap-6">
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              标题 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4 flex gap-4">
            <div className="flex-1">
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

            <div className="w-1/3">
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                封面图片
              </label>
              <ImageUploader
                onUpload={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                defaultImage={formData.coverImage}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              摘要
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="文章摘要（如不填写将自动生成）"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                内容 *
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1 text-sm rounded ${
                    !previewMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1 text-sm rounded ${
                    previewMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  预览
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="border border-gray-300 rounded-md p-4 min-h-[400px] bg-white">
                <MarkdownRenderer content={formData.content || ''} />
              </div>
            ) : (
              <MarkdownEditor
                initialValue={formData.content || ''}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
              />
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                发布
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                推荐
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存文章'}
            </button>
          </div>
        </form>

        <div className="lg:w-1/4">
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="text-lg font-medium mb-3">分类</h3>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-sm">暂无分类</p>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">标签</h3>
            {tags.length === 0 ? (
              <p className="text-gray-500 text-sm">暂无标签</p>
            ) : (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {tag.name}
                    </label>
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
