import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isProduction = host === 'apscore5.com' || host === 'www.apscore5.com';

  if (!isProduction) {
    // Non-production (vercel.app, previews) — block all crawlers completely
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  // Production — allow indexing with standard rules
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