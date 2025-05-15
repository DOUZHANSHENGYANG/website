/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/auth'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap-posts.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap-categories.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap-tags.xml`,
    ],
  },
  exclude: ['/admin/*', '/api/*', '/auth/*'],
  outDir: 'public',
  generateIndexSitemap: true,
};
