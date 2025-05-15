import cache from './cache';

interface FetchOptions extends RequestInit {
  useCache?: boolean;
  cacheTTL?: number;
}

/**
 * 带缓存的API请求函数
 * @param url 请求URL
 * @param options 请求选项
 * @returns 响应数据
 */
export async function fetchAPI<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { useCache = true, cacheTTL, ...fetchOptions } = options;
  
  // 生成缓存键
  const cacheKey = `${url}-${JSON.stringify(fetchOptions)}`;
  
  // 如果启用缓存，尝试从缓存获取
  if (useCache) {
    const cachedData = cache.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
  
  // 发起请求
  const response = await fetch(url, fetchOptions);
  
  // 检查响应状态
  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
  }
  
  // 解析响应数据
  const data = await response.json();
  
  // 如果启用缓存，将数据存入缓存
  if (useCache) {
    cache.set<T>(cacheKey, data, cacheTTL);
  }
  
  return data;
}

/**
 * 获取博客文章列表
 * @param page 页码
 * @param pageSize 每页数量
 * @param options 其他选项
 * @returns 文章列表和元数据
 */
export async function getPosts(page = 1, pageSize = 10, options: Partial<FetchOptions> = {}) {
  const url = `/api/posts?page=${page}&pageSize=${pageSize}`;
  return fetchAPI(url, { useCache: true, cacheTTL: 5 * 60 * 1000, ...options });
}

/**
 * 获取单篇文章
 * @param slug 文章slug或ID
 * @param options 其他选项
 * @returns 文章数据
 */
export async function getPost(slug: string, options: Partial<FetchOptions> = {}) {
  const url = `/api/posts/${slug}`;
  return fetchAPI(url, { useCache: true, cacheTTL: 10 * 60 * 1000, ...options });
}

/**
 * 获取分类列表
 * @param options 其他选项
 * @returns 分类列表
 */
export async function getCategories(options: Partial<FetchOptions> = {}) {
  const url = '/api/categories';
  return fetchAPI(url, { useCache: true, cacheTTL: 30 * 60 * 1000, ...options });
}

/**
 * 获取标签列表
 * @param options 其他选项
 * @returns 标签列表
 */
export async function getTags(options: Partial<FetchOptions> = {}) {
  const url = '/api/tags';
  return fetchAPI(url, { useCache: true, cacheTTL: 30 * 60 * 1000, ...options });
}

/**
 * 获取评论列表
 * @param postId 文章ID
 * @param page 页码
 * @param options 其他选项
 * @returns 评论列表
 */
export async function getComments(postId: string, page = 1, options: Partial<FetchOptions> = {}) {
  const url = `/api/comments?postId=${postId}&page=${page}`;
  return fetchAPI(url, { useCache: true, cacheTTL: 2 * 60 * 1000, ...options });
}

/**
 * 搜索内容
 * @param query 搜索关键词
 * @param type 搜索类型
 * @param page 页码
 * @param options 其他选项
 * @returns 搜索结果
 */
export async function search(query: string, type = 'all', page = 1, options: Partial<FetchOptions> = {}) {
  const url = `/api/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}`;
  return fetchAPI(url, { useCache: true, cacheTTL: 5 * 60 * 1000, ...options });
}
