import React from 'react';

interface WebsiteJsonLdProps {
  url: string;
}

const WebsiteJsonLd: React.FC<WebsiteJsonLdProps> = ({ url }) => {
  // 构建结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '个人博客',
    url: url,
    description: '基于Next.js开发的个人博客网站，分享技术文章、教程和个人见解',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default WebsiteJsonLd;
