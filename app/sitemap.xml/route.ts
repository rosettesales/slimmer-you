import { posts } from '../blog/posts';
import { SITE_URL } from '../seo';
export function GET() {
  const pages=[{path:'/',updated:'2026-10-22'},{path:'/blog',updated:'2026-10-22'},...posts.map(p=>({path:'/blog/'+p.slug,updated:p.updated}))];
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(p=>'<url><loc>'+SITE_URL+p.path+'</loc><lastmod>'+p.updated+'</lastmod></url>').join('')+'</urlset>';
  return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}});
}
