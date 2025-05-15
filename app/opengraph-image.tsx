import { ImageResponse } from 'next/og';

// 路由段配置
export const runtime = 'edge';

// 图片元数据
export const alt = '个人博客';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// 图片生成
export default async function Image() {
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
          个人博客
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#4b5563',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          分享技术文章、教程和个人见解
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
