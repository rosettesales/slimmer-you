import type { Metadata } from 'next';
export const SITE_URL='https://slimmer-you-pamper-spa.rarebat65.chatgpt.site';
export const BUSINESS_NAME='Slimmer You & Pamper Spa';
export const BUSINESS_ID=SITE_URL+'/#business';
export function pageMetadata(title:string,description:string,path:string,image='/images/facial-editorial.jpg',article?:{published:string;updated:string}):Metadata {
  return {
    title,description,alternates:{canonical:SITE_URL+path},
    openGraph:{title,description,url:SITE_URL+path,siteName:BUSINESS_NAME,locale:'en_CA',type:article?'article':'website',images:[{url:SITE_URL+image,alt:title}],
      ...(article?{publishedTime:article.published+'T12:00:00-04:00',modifiedTime:article.updated+'T12:00:00-04:00',authors:[SITE_URL+'/#experience']}:{})},
    twitter:{card:'summary_large_image',title,description,images:[SITE_URL+image]},
  };
}
export function JsonLd({data}:{data:unknown}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>;
}
export const businessSchema={
  '@context':'https://schema.org','@type':'DaySpa','@id':BUSINESS_ID,name:BUSINESS_NAME,url:SITE_URL+'/',telephone:'+1-365-833-0170',
  description:'Facials, body contouring, massage and spa services in Hamilton, Ontario.',image:SITE_URL+'/images/our-spa.jpg',
  address:{'@type':'PostalAddress',streetAddress:'609 Upper Wellington Street',addressLocality:'Hamilton',addressRegion:'ON',postalCode:'L9A 3P8',addressCountry:'CA'},
  areaServed:{'@type':'City',name:'Hamilton'},sameAs:['https://www.instagram.com/slimmeryoupamperspa/'],
};
export function breadcrumbs(items:{name:string;path:string}[]) {
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:SITE_URL+item.path}))};
}
