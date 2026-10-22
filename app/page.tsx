import Spa from './spa';
import { JournalPreview } from './blog/components';
import { pageMetadata } from './seo';
export const metadata=pageMetadata('Spa in Hamilton: Facials, Massage & Body Contouring','Explore facials, massage and body contouring at Slimmer You & Pamper Spa, 609 Upper Wellington Street, Hamilton. Request your appointment online.','/');
export default function Home() { return <Spa journal={<JournalPreview/>}/>; }
