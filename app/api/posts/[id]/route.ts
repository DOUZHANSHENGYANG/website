import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';

// 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 检查是否是slug而不是ID
    const isSlug = isNaN(parseInt(id));
    
    // 构建查询
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:authorId(id, username, avatar),
        categories:post_categories(category:categoryId(*)),
        tags:post_tags(tag:tagId(*))
      `);
    
    // 根据ID或slug查询
    if (isSlug) {
      query = query.eq('slug', id);
    } else {
      query = query.eq('id', id);
    }
    
    // 执行查询
    const { data: post, error } = await query.single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    
    // 增加浏览量
    const { error: updateError } = await supabase
      .from('posts')
      .update({ viewCount: (post.viewCount || 0) + 1 })
      .eq('id', post.id);
    
    if (updateError) {
      console.error('增加浏览量失败:', updateError);
    }
    
    // 格式化响应
    const formattedPost = {
      ...post,
      author: post.author,
      categories: post.categories.map((c: any) => c.category),
      tags: post.tags.map((t: any) => t.tag)
    };
    
    return NextResponse.json(formattedPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // 验证必填字段
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: '标题和内容是必填字段' },
        { status: 400 }
      );
    }
    
    // 更新文章
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        published: body.published,
        featured: body.featured,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    
    // 处理分类（先删除旧关系，再添加新关系）
    if (body.categories) {
      // 删除旧关系
      const { error: deleteError } = await supabase
        .from('post_categories')
        .delete()
        .eq('postId', id);
      
      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }
      
      // 添加新关系
      if (body.categories.length > 0) {
        const categoryRelations = body.categories.map((categoryId: string) => ({
          postId: id,
          categoryId
        }));
        
        const { error: insertError } = await supabase
          .from('post_categories')
          .insert(categoryRelations);
        
        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
      }
    }
    
    // 处理标签（先删除旧关系，再添加新关系）
    if (body.tags) {
      // 删除旧关系
      const { error: deleteError } = await supabase
        .from('post_tags')
        .delete()
        .eq('postId', id);
      
      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }
      
      // 添加新关系
      if (body.tags.length > 0) {
        const tagRelations = body.tags.map((tagId: string) => ({
          postId: id,
          tagId
        }));
        
        const { error: insertError } = await supabase
          .from('post_tags')
          .insert(tagRelations);
        
        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
      }
    }
    
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 删除文章关联的分类关系
    const { error: categoryError } = await supabase
      .from('post_categories')
      .delete()
      .eq('postId', id);
    
    if (categoryError) {
      return NextResponse.json({ error: categoryError.message }, { status: 500 });
    }
    
    // 删除文章关联的标签关系
    const { error: tagError } = await supabase
      .from('post_tags')
      .delete()
      .eq('postId', id);
    
    if (tagError) {
      return NextResponse.json({ error: tagError.message }, { status: 500 });
    }
    
    // 删除文章关联的评论
    const { error: commentError } = await supabase
      .from('comments')
      .delete()
      .eq('postId', id);
    
    if (commentError) {
      return NextResponse.json({ error: commentError.message }, { status: 500 });
    }
    
    // 删除文章
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
