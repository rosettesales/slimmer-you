import type { Metadata } from 'next';
import './globals.css';
import './blog.css';
import { SITE_URL, BUSINESS_NAME, JsonLd, businessSchema } from './seo';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Spa in Hamilton | Slimmer You & Pamper Spa', template: '%s | Slimmer You & Pamper Spa' },
  description: 'Body contouring, facials, massage and moments of calm in Hamilton, Ontario. Request your appointment at Slimmer You & Pamper Spa. No online payment required.',
  icons: { icon: '/favicon.svg' },
  applicationName: BUSINESS_NAME,
  robots: { index:true, follow:true, googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1} },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-CA"><body><JsonLd data={businessSchema}/>{children}</body></html>;
}
