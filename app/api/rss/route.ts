import { NextRequest, NextResponse } from 'next/server';
import { generateMainFeed, generateCategoryFeed } from '@/lib/rss/generator';

// 获取RSS Feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取格式参数
    const format = searchParams.get('format') || 'rss';
    
    // 获取分类参数
    const category = searchParams.get('category');
    
    // 生成Feed
    let feed;
    if (category) {
      feed = await generateCategoryFeed(category);
      
      if (!feed) {
        return NextResponse.json(
          { error: '分类不存在' },
          { status: 404 }
        );
      }
    } else {
      feed = await generateMainFeed();
    }
    
    // 根据格式返回不同的内容
    let content = '';
    let contentType = '';
    
    switch (format.toLowerCase()) {
      case 'json':
        content = feed.json1();
        contentType = 'application/json';
        break;
      case 'atom':
        content = feed.atom1();
        contentType = 'application/atom+xml';
        break;
      case 'rss':
      default:
        content = feed.rss2();
        contentType = 'application/rss+xml';
        break;
    }
    
    // 返回Feed内容
    return new NextResponse(content, {
      headers: {
        'Content-Type': `${contentType}; charset=utf-8`,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error: any) {
    console.error('生成RSS Feed失败:', error);
    return NextResponse.json(
      { error: error.message || '生成RSS Feed失败' },
      { status: 500 }
    );
  }
}
