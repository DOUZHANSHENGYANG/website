import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 搜索参数
    const query = searchParams.get('q');
    if (!query) {
      return NextResponse.json(
        { error: '搜索关键词不能为空' },
        { status: 400 }
      );
    }

    // 分页参数
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 筛选参数
    const type = searchParams.get('type') || 'all'; // 'all', 'post', 'category', 'tag'

    // 计算偏移量
    const offset = (page - 1) * pageSize;

    // 搜索结果
    const results: any = {
      posts: [],
      categories: [],
      tags: [],
      total: 0
    };

    // 根据类型执行不同的搜索
    if (type === 'all' || type === 'post') {
      // 搜索文章
      const { data: posts, error: postsError, count: postsCount } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id(id, username, avatar),
          categories:post_categories(category:category_id(*)),
          tags:post_tags(tag:tag_id(*))
        `, { count: 'exact' })
        .or(`title.ilike.%${query}%, content.ilike.%${query}%, excerpt.ilike.%${query}%`)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (postsError) {
        return NextResponse.json({ error: postsError.message }, { status: 500 });
      }

      // 格式化文章数据
      results.posts = posts.map((post: any) => ({
        ...post,
        author: post.author,
        categories: post.categories.map((c: any) => c.category),
        tags: post.tags.map((t: any) => t.tag)
      }));

      results.total += postsCount || 0;
    }

    if (type === 'all' || type === 'category') {
      // 搜索分类
      const { data: categories, error: categoriesError, count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact' })
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .range(offset, offset + pageSize - 1);

      if (categoriesError) {
        return NextResponse.json({ error: categoriesError.message }, { status: 500 });
      }

      results.categories = categories;

      if (type === 'category') {
        results.total = categoriesCount || 0;
      } else {
        results.total += categoriesCount || 0;
      }
    }

    if (type === 'all' || type === 'tag') {
      // 搜索标签
      const { data: tags, error: tagsError, count: tagsCount } = await supabase
        .from('tags')
        .select('*', { count: 'exact' })
        .ilike('name', `%${query}%`)
        .range(offset, offset + pageSize - 1);

      if (tagsError) {
        return NextResponse.json({ error: tagsError.message }, { status: 500 });
      }

      results.tags = tags;

      if (type === 'tag') {
        results.total = tagsCount || 0;
      } else {
        results.total += tagsCount || 0;
      }
    }

    return NextResponse.json({
      data: results,
      meta: {
        query,
        type,
        total: results.total,
        page,
        pageSize,
        pageCount: Math.ceil(results.total / pageSize)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
