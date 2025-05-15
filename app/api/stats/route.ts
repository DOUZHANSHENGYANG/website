import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';

// 获取统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, month, week, day
    
    // 获取文章总数
    const { count: postsCount, error: postsError } = await supabase
      .from('posts')
      .select('*', { count: 'exact' });
    
    if (postsError) {
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }
    
    // 获取已发布文章数
    const { count: publishedPostsCount, error: publishedError } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('published', true);
    
    if (publishedError) {
      return NextResponse.json({ error: publishedError.message }, { status: 500 });
    }
    
    // 获取评论总数
    const { count: commentsCount, error: commentsError } = await supabase
      .from('comments')
      .select('*', { count: 'exact' });
    
    if (commentsError) {
      return NextResponse.json({ error: commentsError.message }, { status: 500 });
    }
    
    // 获取总访问量
    const { data: viewsData, error: viewsError } = await supabase
      .from('posts')
      .select('view_count');
    
    if (viewsError) {
      return NextResponse.json({ error: viewsError.message }, { status: 500 });
    }
    
    const totalViews = viewsData.reduce((sum, post) => sum + (post.view_count || 0), 0);
    
    // 获取热门文章
    const { data: popularPosts, error: popularError } = await supabase
      .from('posts')
      .select(`
        id, title, slug, view_count, created_at,
        author:author_id(id, username, avatar)
      `)
      .eq('published', true)
      .order('view_count', { ascending: false })
      .limit(5);
    
    if (popularError) {
      return NextResponse.json({ error: popularError.message }, { status: 500 });
    }
    
    // 获取最近评论
    const { data: recentComments, error: recentCommentsError } = await supabase
      .from('comments')
      .select(`
        id, content, created_at,
        post:post_id(id, title, slug),
        user:user_id(id, username, avatar)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentCommentsError) {
      return NextResponse.json({ error: recentCommentsError.message }, { status: 500 });
    }
    
    // 获取分类统计
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id, name, slug,
        posts:post_categories(post:post_id(id))
      `);
    
    if (categoriesError) {
      return NextResponse.json({ error: categoriesError.message }, { status: 500 });
    }
    
    const categoryStats = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category.posts ? category.posts.length : 0
    }));
    
    // 获取标签统计
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select(`
        id, name, slug,
        posts:post_tags(post:post_id(id))
      `);
    
    if (tagsError) {
      return NextResponse.json({ error: tagsError.message }, { status: 500 });
    }
    
    const tagStats = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.posts ? tag.posts.length : 0
    }));
    
    // 获取每月文章发布统计
    const { data: posts, error: postsTimeError } = await supabase
      .from('posts')
      .select('created_at')
      .eq('published', true);
    
    if (postsTimeError) {
      return NextResponse.json({ error: postsTimeError.message }, { status: 500 });
    }
    
    // 按月份统计文章数
    const monthlyPosts: Record<string, number> = {};
    posts.forEach((post) => {
      const date = new Date(post.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyPosts[monthYear] = (monthlyPosts[monthYear] || 0) + 1;
    });
    
    // 返回统计数据
    return NextResponse.json({
      summary: {
        postsCount,
        publishedPostsCount,
        commentsCount,
        totalViews
      },
      popularPosts,
      recentComments,
      categoryStats,
      tagStats,
      monthlyPosts
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
