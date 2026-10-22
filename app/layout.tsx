import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Slimmer You & Pamper Spa | Your moment, beautifully yours',
  description: 'Body contouring, facials, massage and moments of calm in Hamilton, Ontario. Request your appointment at Slimmer You & Pamper Spa. No online payment required.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
