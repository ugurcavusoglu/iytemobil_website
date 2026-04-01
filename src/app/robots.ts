import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/login'],
      },
    ],
    sitemap: 'https://iytemobil.com/sitemap.xml',
    host: 'https://iytemobil.com',
  };
}
