const fs = require('fs');
const path = require('path');
const routesConfig = require('../src/config/routesConfig.json');

const domain = process.env.REACT_APP_SITE_URL || 'https://cafeteriadelcaos.com';

function generateSitemap(): void {
  const publicRoutes = routesConfig.publicRoutes.filter((route: any) => {
    return !route.path.includes(':') && 
           !route.hidden && 
           !route.seo?.robots?.includes('noindex') &&
           !['/login', '/register', '/privacy'].includes(route.path);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${publicRoutes.map((route: any) => `
  <url>
    <loc>${domain}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), xml);
  console.log('Sitemap generated successfully!');
}

generateSitemap();

export {};
