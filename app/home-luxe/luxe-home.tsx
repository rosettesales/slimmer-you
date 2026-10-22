'use client';
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { ArrowUpRight, ArrowDown, ArrowRight, Pause, Play, Menu, X, MapPin, Heart, Phone } from 'lucide-react';
import Spa from '../spa';
import { services } from '../booking-data';

function Rosette({className=''}:{className?:string}){
  return <svg className={className} viewBox="0 0 200 200" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth=".7">{[0,30,60,90,120,150].map(a=><ellipse key={a} cx="100" cy="100" rx="28" ry="91" transform={'rotate('+a+' 100 100)'}/>)}<circle cx="100" cy="100" r="14"/><circle cx="100" cy="100" r="97" strokeDasharray="1 8"/></g></svg>;
}
function Botanical(){
  return <svg className="luxe-botanical" viewBox="0 0 380 580" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1"><path d="M170 570C265 430 86 300 231 41M187 464C127 401 68 428 52 341C144 355 176 403 187 464ZM190 405C268 347 296 353 331 273C242 295 207 342 190 405ZM173 334C114 295 64 282 70 203C147 233 165 278 173 334ZM174 278C245 240 273 230 287 151C222 176 191 217 174 278ZM194 171C147 143 136 107 148 55C195 85 204 129 194 171ZM216 100C255 93 284 58 282 8C240 25 224 58 216 100Z"/><path d="M188 465L65 357M190 405L317 288M173 334L82 218M174 278L275 165M194 171L154 69M216 100L274 21" opacity=".5"/></g></svg>;
}
const maps='https://www.google.com/maps/search/?api=1&query=609+Upper+Wellington+Street+Hamilton+Ontario';
const labels=['A little glow.','A little confidence.','A deeper exhale.','A gentle reset.'];
export default function LuxeHome({journal}:{journal:ReactNode}){
  const [menu,setMenu]=useState(false);
  const [paused,setPaused]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [active,setActive]=useState(0);
  const [serviceRequest,setServiceRequest]=useState<{id:string;key:number}>();
  const root=useRef<HTMLDivElement>(null);
  const hero=useRef<HTMLElement>(null);
  const selected=services[active];
  useEffect(()=>{
    root.current?.classList.add('luxe-enhanced');
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(media.matches);
    const change=()=>setPaused(media.matches);
    media.addEventListener('change',change);
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('luxe-visible');observer.unobserve(e.target);}}),{threshold:.1});
    root.current?.querySelectorAll('[data-luxe-reveal]').forEach(e=>observer.observe(e));
    let frame=0;
    const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>setScrolled(scrollY>70));};
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false);};
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('keydown',onKey);
    return ()=>{observer.disconnect();cancelAnimationFrame(frame);media.removeEventListener('change',change);window.removeEventListener('scroll',onScroll);document.removeEventListener('keydown',onKey);};
  },[]);
  function request(id:string){
    setServiceRequest({id,key:Date.now()});
    document.getElementById('booking')?.scrollIntoView({behavior:paused?'instant':'smooth'});
  }
  return <div className="luxe-home" ref={root} data-luxe-motion={paused?'off':'on'}>
    <a className="skip-link" href="#luxe-main">Skip to content</a>
    <header className={'luxe-header '+(scrolled||menu?'luxe-header-solid':'')}>
      <a href="/home-luxe" className="luxe-logo" aria-label="Slimmer You & Pamper Spa home"><Rosette/><span>slimmer you<small>& PAMPER SPA</small></span></a>
      <nav className={menu?'luxe-nav luxe-nav-open':'luxe-nav'} aria-label="Main navigation">{[['The rituals','#luxe-rituals'],['Our world','#luxe-world'],['The journal','/blog'],['Visit us','#luxe-visit']].map(([name,url])=><a key={url} href={url} onClick={()=>setMenu(false)}>{name}</a>)}</nav>
      <div className="luxe-header-actions"><button className="luxe-motion" aria-label={paused?'Enable animations':'Pause animations'} onClick={()=>setPaused(!paused)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button><a className="luxe-header-book" href="#booking">Book a moment <ArrowUpRight size={15}/></a><button className="luxe-menu" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
    </header>
    <main id="luxe-main">
      <section className="luxe-hero" ref={hero} onPointerMove={e=>{if(paused||e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();hero.current?.style.setProperty('--drift-x',((e.clientX-r.left)/r.width-.5)*22+'px');hero.current?.style.setProperty('--drift-y',((e.clientY-r.top)/r.height-.5)*16+'px');}} onPointerLeave={()=>{hero.current?.style.setProperty('--drift-x','0px');hero.current?.style.setProperty('--drift-y','0px');}}>
        <div className="luxe-hero-image"><img src="/images/facial-editorial.jpg" alt="A serene moment during a facial treatment" fetchPriority="high"/></div><div className="luxe-hero-shade"/><div className="luxe-silk" aria-hidden="true"/><div className="luxe-grain" aria-hidden="true"/>
        <div className="luxe-hero-art" aria-hidden="true"><div className="luxe-orbit orbit-one"/><div className="luxe-orbit orbit-two"/><Rosette className="luxe-hero-rosette"/><Botanical/>{Array.from({length:11},(_,i)=><span className="luxe-mote" key={i} style={{'--i':i,left:(13+i*7.7)+'%',top:(19+(i*19)%62)+'%'} as CSSProperties}/>)}</div>
        <div className="luxe-hero-content"><p className="luxe-eyebrow"><span/> A BEAUTIFUL ESCAPE. RIGHT HERE IN HAMILTON.</p><h1><span>Make room</span><span>for a little</span><em>extraordinary.</em></h1><p className="luxe-hero-description">A caring touch. A softer pace. A moment<br/>that belongs entirely to you.</p><div className="luxe-hero-ctas"><a className="luxe-button" href="#booking">Your moment starts here <ArrowUpRight size={19}/></a><a className="luxe-link cream" href="#luxe-rituals">Discover the rituals <ArrowDown size={15}/></a></div></div>
        <div className="luxe-seal" aria-hidden="true"><svg viewBox="0 0 140 140"><defs><path id="luxe-seal-path" d="M70,70m-52,0a52,52 0 1,1 104,0a52,52 0 1,1 -104,0"/></defs><text><textPath href="#luxe-seal-path">RELAX · REVIVE · RENEW · MADE FOR YOUR MOMENT · </textPath></text></svg><span>just<br/><em>you.</em></span></div>
        <div className="luxe-floating-note"><span><Heart size={18} strokeWidth={1.2}/></span><div>Consider this your invitation.<small>To slow down. To feel good. To be you.</small></div></div>
        <div className="luxe-hero-bottom"><a href="#luxe-rituals"><span className="luxe-scroll-line"/>SCROLL INTO SOMETHING LOVELY</a><span>BODY. SKIN. A LITTLE PEACE OF MIND.</span><span>01 — 03</span></div>
      </section>
      <div className="luxe-ribbon" aria-label="Relax, revive, renew"><div>{Array.from({length:6},(_,i)=><span key={i} aria-hidden={i>0}>THE ART OF FEELING GOOD <i>✳</i> RELAX. REVIVE. RENEW. <i>✳</i></span>)}</div></div>
      <section className="luxe-intro" id="luxe-world"><Rosette className="luxe-intro-flower"/><p className="luxe-eyebrow" data-luxe-reveal>A LITTLE LESS EVERYDAY. A LITTLE MORE YOU.</p><h2 data-luxe-reveal>Some moments<br/>are worth <em>making time for.</em></h2><p data-luxe-reveal>At Slimmer You & Pamper Spa, self-care is an invitation to reconnect.<br/>With your body. With your confidence. With the simple pleasure of slowing down.</p><div className="luxe-intro-line" data-luxe-reveal><span/>YOUR HAMILTON ESCAPE<span/></div></section>
      <section className="luxe-rituals" id="luxe-rituals"><div className="luxe-rituals-copy" data-luxe-reveal><p className="luxe-eyebrow">01 / THE RITUALS</p><h2>Whatever you need.<br/><em>A little more of it.</em></h2><p>Explore a collection of experiences,<br/>each with a little room for you.</p><div className="luxe-treatment-tabs" role="tablist" aria-label="Explore spa treatments">{services.slice(0,4).map((s,i)=><button key={s.id} id={'luxe-tab-'+s.id} role="tab" aria-selected={active===i} aria-controls="luxe-treatment-panel" tabIndex={active===i?0:-1} className={active===i?'active':''} onClick={()=>setActive(i)} onKeyDown={e=>{let next=i;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%4;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i+3)%4;else if(e.key==='Home')next=0;else if(e.key==='End')next=3;else return;e.preventDefault();setActive(next);document.getElementById('luxe-tab-'+services[next].id)?.focus();}}><span>0{i+1}</span><strong>{s.name}</strong><ArrowUpRight size={21}/></button>)}</div><button className="luxe-link" onClick={()=>request('consultation')}>Let us help you choose <ArrowRight size={17}/></button></div><div className="luxe-treatment-panel" id="luxe-treatment-panel" role="tabpanel" aria-labelledby={'luxe-tab-'+selected.id} tabIndex={0}><div className="luxe-treatment-frame" key={selected.id}><img src={selected.image} alt={selected.alt} loading="lazy"/><span className="luxe-image-label">{selected.category}</span><Rosette className="luxe-treatment-flower"/></div><div className="luxe-treatment-caption" key={selected.id+'-caption'}><div><h3>{labels[active]}</h3><p>{selected.description}</p></div><button className="luxe-circle-button" aria-label={'Request '+selected.name} onClick={()=>request(selected.id)}><ArrowUpRight size={26}/></button></div></div></section>
      <section className="luxe-pause"><div className="luxe-pause-image"><img src="/images/massage.jpg" alt="A relaxing massage ritual" loading="lazy"/></div><div className="luxe-pause-copy" data-luxe-reveal><p className="luxe-eyebrow">PERMISSION TO PUT YOURSELF FIRST.</p><h2>Let the world wait.<br/><em>Just for a moment.</em></h2><p>No reason needed. No special occasion required.<br/>Just you, making a little space for yourself.</p><a className="luxe-link cream" href="#booking">Make that moment yours <ArrowUpRight size={18}/></a></div><Rosette className="luxe-pause-flower"/></section>
      <section className="luxe-details" data-luxe-reveal><div><span>01</span><h3>Care that feels personal.</h3><p>A conversation about your goals.<br/>An experience chosen with you.</p></div><div><span>02</span><h3>A softer kind of schedule.</h3><p>Choose a preferred time.<br/>Confirm the details with our team.</p></div><div><span>03</span><h3>Close to home. Far from busy.</h3><p>A little escape on Upper Wellington.<br/>Made for your Hamilton day.</p></div></section>
      <div className="luxe-booking"><Spa bookingOnly serviceRequest={serviceRequest}/></div>
      <div className="luxe-journal">{journal}</div>
      <section className="luxe-visit" id="luxe-visit"><div className="luxe-visit-photo" data-luxe-reveal><img src="/images/our-spa.jpg" alt="A gathering at Slimmer You & Pamper Spa in Hamilton" loading="lazy"/><span>REAL MOMENTS. OUR HAMILTON SPA.</span></div><div className="luxe-visit-copy" data-luxe-reveal><p className="luxe-eyebrow">YOUR NEIGHBOURHOOD ESCAPE</p><h2>A warm welcome.<br/><em>A world of you.</em></h2><p>Find your moment of calm<br/>at Slimmer You & Pamper Spa.</p><address><MapPin size={17}/><span>609 Upper Wellington Street<br/>Hamilton, ON L9A 3P8</span></address><a href="tel:+13658330170" className="luxe-phone"><Phone size={16}/>365 833 0170</a><a className="luxe-button plum" href={maps} target="_blank" rel="noreferrer">Find your way here <ArrowUpRight size={18}/></a></div></section>
      <section className="luxe-final"><Rosette/><p className="luxe-eyebrow">THIS ONE IS FOR YOU.</p><a href="#booking">A little time.<br/><em>A beautiful feeling.</em><ArrowUpRight strokeWidth={1}/></a><span>RELAX. REVIVE. RENEW.</span></section>
    </main>
    <footer className="luxe-footer"><a href="/home-luxe" className="luxe-logo"><Rosette/><span>slimmer you<small>& PAMPER SPA</small></span></a><nav aria-label="Footer navigation"><a href="/">Original</a><a href="/home-light">Light edition</a><a href="/blog">The journal</a><a href="https://www.instagram.com/slimmeryoupamperspa/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={12}/></a></nav><p>© 2026 Slimmer You & Pamper Spa · Hamilton, Ontario</p><small>Appointment requests are pending until confirmed with the spa. No online payment. Editorial imagery appears alongside photographs of our location.</small></footer>
  </div>;
}
