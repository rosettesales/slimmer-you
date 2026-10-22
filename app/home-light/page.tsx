import LightHome from './light-home';
import { JournalPreview } from '../blog/components';
import { pageMetadata, SITE_URL } from '../seo';
import './light.css';
export const metadata={
  ...pageMetadata('A Little Care. A Whole New Feeling.','Discover a lighter side of self-care. Explore facials, massage, body contouring and appointment requests at Slimmer You & Pamper Spa in Hamilton.','/home-light'),
  alternates:{canonical:SITE_URL+'/'},
  robots:{index:false,follow:true,googleBot:{index:false,follow:true}},
};
export default function LightPage() { return <LightHome journal={<JournalPreview/>}/>; }
