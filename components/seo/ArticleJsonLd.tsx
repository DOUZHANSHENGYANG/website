import React from 'react';
import { FullPost } from '@/types';

interface ArticleJsonLdProps {
  post: FullPost;
  url: string;
}

const ArticleJsonLd: React.FC<ArticleJsonLdProps> = ({ post, url }) => {
  // 构建结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.createdAt instanceof Date ? post.createdAt.toISOString() : new Date(post.createdAt).toISOString(),
    dateModified: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : new Date(post.updatedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.username,
    },
    publisher: {
      '@type': 'Organization',
      name: '个人博客',
      logo: {
        '@type': 'ImageObject',
        url: `${url.split('/blog/')[0]}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: [...post.tags.map(tag => tag.name), ...post.categories.map(cat => cat.name)].join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ArticleJsonLd;
