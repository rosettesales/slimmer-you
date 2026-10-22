import LuxeHome from './luxe-home';
import { JournalPreview } from '../blog/components';
import { pageMetadata, SITE_URL } from '../seo';
import './luxe.css';
export const metadata={
  ...pageMetadata('Your Moment, Made Extraordinary','A luxurious moment of self-care at Slimmer You & Pamper Spa in Hamilton. Explore treatments, our journal and the appointment-request calendar.','/home-luxe'),
  alternates:{canonical:SITE_URL+'/'},
  robots:{index:false,follow:true,googleBot:{index:false,follow:true}},
};
export default function LuxePage(){return <LuxeHome journal={<JournalPreview/>}/>;}
