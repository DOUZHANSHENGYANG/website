// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  githubUrl?: string;
  googleEmail?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// 文章类型定义
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  featured: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  sourceUrl?: string;
  sourceType?: 'docx' | 'markdown' | 'manual';
}

// 分类类型定义
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// 标签类型定义
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// 评论类型定义
export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 带有作者信息的文章类型
export interface PostWithAuthor extends Post {
  author: User;
}

// 带有分类信息的文章类型
export interface PostWithCategories extends Post {
  categories: Category[];
}

// 带有标签信息的文章类型
export interface PostWithTags extends Post {
  tags: Tag[];
}

// 完整的文章类型（包含作者、分类和标签）
export interface FullPost extends Post {
  author: User;
  categories: Category[];
  tags: Tag[];
  comments?: Comment[];
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

// 搜索参数类型
export interface SearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  featured?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}
