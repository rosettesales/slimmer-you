'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronRight, Plus, X, Menu, Leaf, Heart, CalendarDays, MapPin, Phone, Pause, Play, Sparkles } from 'lucide-react';
import Spa from '../spa';
import { services } from '../booking-data';

const experiences=[
  {id:'facial',label:'Facials',headline:'Hello, fresh-faced.',description:'A little attention. A lovely glow.',image:'/images/facial-editorial.jpg',alt:'A peaceful facial treatment',theme:'face'},
  {id:'massage',label:'Massage',headline:'And… exhale.',description:'Make room for a slower kind of day.',image:'/images/massage.jpg',alt:'Relaxing massage in a spa setting',theme:'massage'},
  {id:'body',label:'Body contouring',headline:'Your goals. Your pace.',description:'Explore your options with a personal conversation.',image:'/images/body-contouring.webp',alt:'Non-invasive body-contouring equipment',theme:'body'},
  {id:'wellness',label:'Wellness rituals',headline:'A little reset.',description:'Small moments. Just for you.',image:'/images/ritual.jpg',alt:'Botanical oils and self-care essentials',theme:'wellness'},
];
const maps='https://www.google.com/maps/search/?api=1&query=609+Upper+Wellington+Street+Hamilton+Ontario';
export default function LightHome({journal}:{journal:ReactNode}) {
  const [menu,setMenu]=useState(false);
  const [paused,setPaused]=useState(false);
  const [detail,setDetail]=useState<string|null>(null);
  const [serviceRequest,setServiceRequest]=useState<{id:string;key:number}>();
  const root=useRef<HTMLDivElement>(null);
  const modal=useRef<HTMLDialogElement>(null);
  const selected=services.find(s=>s.id===detail);
  useEffect(()=>{
    root.current?.classList.add('light-enhanced');
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(media.matches);
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('light-visible');observer.unobserve(e.target);}}),{threshold:.12});
    root.current?.querySelectorAll('[data-light-reveal]').forEach(e=>observer.observe(e));
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setMenu(false);};
    document.addEventListener('keydown',escape);
    return ()=>{observer.disconnect();document.removeEventListener('keydown',escape);};
  },[]);
  useEffect(()=>{
    if(detail)modal.current?.showModal();else modal.current?.close();
  },[detail]);
  function request(id:string) {
    setDetail(null);setServiceRequest({id,key:Date.now()});
    document.getElementById('booking')?.scrollIntoView({behavior:paused?'instant':'smooth'});
  }
  return <div ref={root} className="light-home" data-light-motion={paused?'off':'on'}>
    <a className="skip-link" href="#light-main">Skip to content</a>
    <header className="light-global">
      <div className="light-global-inner"><a href="/home-light" className="light-mark" aria-label="Slimmer You & Pamper Spa home"><Leaf size={21} strokeWidth={1.6}/><span>slimmer you</span></a>
        <nav className={menu?'light-nav light-nav-open':'light-nav'} aria-label="Main navigation">
          {[['Explore','#light-main'],['Treatments','#light-treatments'],['Our spa','#light-visit'],['Journal','/blog'],['Book a visit','#booking']].map(([label,href])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}
        </nav>
        <div className="light-global-controls"><button aria-label={paused?'Enable animations':'Pause animations'} title={paused?'Enable animations':'Pause animations'} onClick={()=>setPaused(!paused)}>{paused?<Play size={14}/>:<Pause size={14}/>}</button><a href="tel:+13658330170" aria-label="Call the spa"><Phone size={16}/></a><button className="light-menu" aria-expanded={menu} aria-label={menu?'Close menu':'Open menu'} onClick={()=>setMenu(!menu)}>{menu?<X size={21}/>:<Menu size={21}/>}</button></div>
      </div>
    </header>
    <div className="light-localnav"><div><a href="/home-light">Slimmer You <span>& Pamper Spa</span></a><div><span>Hamilton, Ontario</span><a className="light-pill small" href="#booking">Book a visit</a></div></div></div>
    <div className="light-announcement">A little time for you. No online payment required.<a href="#booking">Find your moment <ChevronRight size={13}/></a></div>
    <main id="light-main">
      <section className="light-hero">
        <div className="light-hero-copy"><p className="light-kicker">SELF-CARE. BEAUTIFULLY SIMPLE.</p><h1>A little care.<br/><span>A whole new feeling.</span></h1><p>Feel more like you. With facials, body care<br className="light-desktop-break"/> and moments of calm, right here in Hamilton.</p><div className="light-actions"><a className="light-pill" href="#booking">Book your moment</a><a className="light-link" href="#light-treatments">Explore treatments <ChevronRight size={17}/></a></div></div>
        <div className="light-hero-photo"><img src="/images/facial-editorial.jpg" alt="A quiet, restorative moment during a facial" fetchPriority="high"/><div className="light-photo-message"><span className="light-photo-icon"><Heart size={18}/></span><span>Your time.<br/><strong>Well spent.</strong></span></div><div className="light-image-note"><span/> A LITTLE PAUSE LOOKS GOOD ON YOU.</div></div>
        <div className="light-hero-foot"><span>Relax.</span><span>Revive.</span><span>Renew.</span></div>
      </section>
      <section className="light-experiences" id="light-treatments">
        <div className="light-section-heading" data-light-reveal><h2>Find your kind<br className="light-mobile-break"/> of feel-good.</h2><p>One place. So many ways to care for you.</p></div>
        <div className="light-treatment-grid">{experiences.map((e,i)=><article key={e.id} className={'light-treatment light-'+e.theme} data-light-reveal style={{transitionDelay:(i%2)*80+'ms'}}><div className="light-treatment-copy"><p className="light-label">{e.label}</p><h3>{e.headline}</h3><p>{e.description}</p><div className="light-actions"><button className="light-pill" onClick={()=>request(e.id)}>Request a visit</button><button className="light-link" onClick={()=>setDetail(e.id)} aria-label={'Learn more about '+e.label}>Learn more <ChevronRight size={15}/></button></div></div><div className="light-treatment-image"><img src={e.image} alt={e.alt} loading="lazy"/></div><button className="light-more" aria-label={'Explore '+e.label} onClick={()=>setDetail(e.id)}><Plus size={19}/></button></article>)}</div>
      </section>
      <section className="light-difference">
        <div className="light-section-heading" data-light-reveal><p className="light-kicker">THE LITTLE THINGS. THOUGHTFULLY DONE.</p><h2>Good for your day.<br/><span>Even better for you.</span></h2></div>
        <div className="light-benefits" data-light-reveal><div><Heart size={33} strokeWidth={1.5}/><h3>A personal touch.</h3><p>Your goals. Your preferences.<br/>A conversation that starts with you.</p></div><div><CalendarDays size={33} strokeWidth={1.5}/><h3>Simple from the start.</h3><p>Request a time online.<br/>Confirm the details with our team.</p></div><div><MapPin size={33} strokeWidth={1.5}/><h3>A little closer to calm.</h3><p>Your neighbourhood escape,<br/>on Upper Wellington Street.</p></div></div>
        <button className="light-link" onClick={()=>request('consultation')}>Not sure where to start? Let’s talk <ChevronRight size={17}/></button>
      </section>
      <div className="light-booking"><Spa bookingOnly serviceRequest={serviceRequest}/></div>
      <section className="light-visit" id="light-visit"><div className="light-visit-copy" data-light-reveal><p className="light-kicker">YOUR HAMILTON SPA</p><h2>Come as you are.<br/><span>Make yourself<br/>at home.</span></h2><p>A welcoming space for a little self-care.<br/>And a team ready to help you find your moment.</p><address>609 Upper Wellington Street<br/>Hamilton, ON L9A 3P8</address><div className="light-actions"><a className="light-pill" href={maps} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15}/></a><a className="light-link" href="tel:+13658330170">Call our team <ChevronRight size={16}/></a></div></div><div className="light-visit-image" data-light-reveal><img src="/images/our-spa.jpg" alt="Guests enjoying a gathering at Slimmer You & Pamper Spa" loading="lazy"/></div></section>
      <div className="light-journal">{journal}</div>
      <section className="light-closing" data-light-reveal><Leaf size={38} strokeWidth={1.2}/><h2>You time.<br/><span>It’s a beautiful thing.</span></h2><p>Make a little room in your calendar.</p><a className="light-pill" href="#booking">Find your moment</a></section>
    </main>
    <footer className="light-footer"><div className="light-footer-notes"><p>Appointment requests are subject to confirmation. Preferred times are 9 a.m.–5 p.m. Eastern Time. Call 365-833-0170 to confirm your appointment before visiting.</p><p>Treatment suitability, duration and pricing are discussed with the spa. Editorial treatment imagery appears alongside photographs of our Hamilton location.</p></div><div className="light-footer-main"><a href="/home-light" className="light-mark"><Leaf size={20}/><span>slimmer you</span></a><nav aria-label="Footer navigation"><a href="#light-treatments">Treatments</a><a href="/blog">The journal</a><a href="https://www.instagram.com/slimmeryoupamperspa/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={12}/></a><a href="/">Original homepage</a></nav></div><div className="light-footer-bottom"><span>© 2026 Slimmer You & Pamper Spa. All rights reserved.</span><span>Hamilton, Ontario</span></div></footer>
    <dialog ref={modal} className="light-detail" aria-labelledby="light-detail-title" onCancel={()=>setDetail(null)} onClick={e=>{if(e.target===e.currentTarget)setDetail(null);}}>
      <button className="light-detail-close" aria-label="Close treatment details" onClick={()=>setDetail(null)}><X size={20}/></button>
      {selected&&<><img src={selected.image} alt={selected.alt}/><div className="light-detail-copy"><p className="light-kicker">A LITTLE MORE ABOUT</p><h2 id="light-detail-title">{selected.name}</h2><p>{selected.description}</p><div className="light-detail-facts"><Sparkles size={17}/>{selected.tags}</div><p className="light-detail-note">We’ll discuss suitability, treatment length and pricing before your visit. Your online request is pending until confirmed with the spa.</p><button className="light-pill" onClick={()=>request(selected.id)}>Request this experience <ChevronRight size={16}/></button></div></>}
    </dialog>
  </div>;
}
