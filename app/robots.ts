import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/signup', '/api/', '/slice-simulator'],
      },
    ],
    sitemap: 'https://apscore5.com/sitemap.xml',
    host: 'https://apscore5.com',
  };
}