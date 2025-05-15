import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';
import { Post } from '@/types';

// 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 分页参数
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    // 筛选参数
    const categoryId = searchParams.get('categoryId');
    const tagId = searchParams.get('tagId');
    const authorId = searchParams.get('authorId');
    const featured = searchParams.get('featured') === 'true';
    
    // 排序参数
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // 搜索参数
    const query = searchParams.get('query') || '';
    
    // 计算偏移量
    const offset = (page - 1) * pageSize;
    
    // 构建查询
    let postsQuery = supabase
      .from('posts')
      .select(`
        *,
        author:authorId(id, username, avatar),
        categories:post_categories(category:categoryId(*)),
        tags:post_tags(tag:tagId(*))
      `)
      .order(sortBy as any, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);
    
    // 添加筛选条件
    if (categoryId) {
      postsQuery = postsQuery.eq('post_categories.categoryId', categoryId);
    }
    
    if (tagId) {
      postsQuery = postsQuery.eq('post_tags.tagId', tagId);
    }
    
    if (authorId) {
      postsQuery = postsQuery.eq('authorId', authorId);
    }
    
    if (featured) {
      postsQuery = postsQuery.eq('featured', true);
    }
    
    if (query) {
      postsQuery = postsQuery.or(`title.ilike.%${query}%, content.ilike.%${query}%`);
    }
    
    // 默认只返回已发布的文章
    postsQuery = postsQuery.eq('published', true);
    
    // 执行查询
    const { data: posts, error, count } = await postsQuery;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 获取总数
    const { count: totalCount, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('published', true);
    
    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }
    
    // 格式化响应
    const formattedPosts = posts.map((post: any) => ({
      ...post,
      author: post.author,
      categories: post.categories.map((c: any) => c.category),
      tags: post.tags.map((t: any) => t.tag)
    }));
    
    return NextResponse.json({
      data: formattedPosts,
      meta: {
        total: totalCount || 0,
        page,
        pageSize,
        pageCount: Math.ceil((totalCount || 0) / pageSize)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.title || !body.content || !body.authorId) {
      return NextResponse.json(
        { error: '标题、内容和作者ID是必填字段' },
        { status: 400 }
      );
    }
    
    // 生成slug
    const slug = body.slug || generateSlug(body.title);
    
    // 创建文章
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        title: body.title,
        slug,
        content: body.content,
        excerpt: body.excerpt || generateExcerpt(body.content),
        coverImage: body.coverImage,
        published: body.published !== undefined ? body.published : false,
        featured: body.featured || false,
        authorId: body.authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 处理分类
    if (body.categories && body.categories.length > 0) {
      const categoryRelations = body.categories.map((categoryId: string) => ({
        postId: post.id,
        categoryId
      }));
      
      const { error: categoryError } = await supabase
        .from('post_categories')
        .insert(categoryRelations);
      
      if (categoryError) {
        return NextResponse.json({ error: categoryError.message }, { status: 500 });
      }
    }
    
    // 处理标签
    if (body.tags && body.tags.length > 0) {
      const tagRelations = body.tags.map((tagId: string) => ({
        postId: post.id,
        tagId
      }));
      
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(tagRelations);
      
      if (tagError) {
        return NextResponse.json({ error: tagError.message }, { status: 500 });
      }
    }
    
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 生成slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 生成摘要
function generateExcerpt(content: string, maxLength: number = 150): string {
  // 移除Markdown标记
  const plainText = content
    .replace(/#+\s+(.*)/g, '$1') // 标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
    .replace(/\*(.*?)\*/g, '$1') // 斜体
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 链接
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // 图片
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // 代码
    .replace(/~~(.*?)~~/g, '$1') // 删除线
    .replace(/>\s+(.*)/g, '$1') // 引用
    .replace(/\n/g, ' ') // 换行
    .trim();
  
  // 截取指定长度
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength) + '...';
}
