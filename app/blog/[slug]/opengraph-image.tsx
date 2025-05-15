import { ImageResponse } from 'next/og';
import { getPostBySlug } from './page';

// 路由段配置
export const runtime = 'edge';

// 图片元数据
export const alt = '文章封面图';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// 图片生成
export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'linear-gradient(to bottom, #f9fafb, #e5e7eb)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 48,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 24,
            }}
          >
            文章不存在
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom, #f9fafb, #e5e7eb)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 48,
          position: 'relative',
        }}
      >
        {/* 背景图片 */}
        {post.coverImage && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${post.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
            }}
          />
        )}
        
        {/* 渐变遮罩 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 30%, transparent 70%)',
          }}
        />
        
        {/* 文章标题 */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 24,
            position: 'relative',
            maxWidth: '80%',
            lineHeight: 1.2,
          }}
        >
          {post.title}
        </div>
        
        {/* 作者信息 */}
        <div
          style={{
            fontSize: 32,
            color: '#e5e7eb',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: 16 }}>
            {post.author.username}
          </div>
          <div>•</div>
          <div style={{ marginLeft: 16 }}>
            {new Date(post.createdAt).toLocaleDateString('zh-CN')}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
