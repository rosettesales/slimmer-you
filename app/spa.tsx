'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, ChevronLeft, ChevronRight, Check, Plus, Minus, Menu, X, MapPin, Phone, Camera as Instagram, Leaf, Sparkles, Pause, Play, Heart, CalendarDays } from 'lucide-react';
import { services, times, torontoNow, lastBookingDate, validSlot, prettyTime, prettyDate } from './booking-data';

const ig = 'https://www.instagram.com/slimmeryoupamperspa/';
const maps = 'https://www.google.com/maps/search/?api=1&query=609+Upper+Wellington+Street+Hamilton+Ontario';
const faqs = [
  ['How does online booking work?', 'Choose a treatment, a preferred date and time, and leave your contact details. Your request is saved as pending. Your appointment is only confirmed once you have spoken with the spa. For confirmation or urgent requests, call 365-833-0170.'],
  ['Do I need to pay when I book?', 'No. There is no online payment, deposit or card information required to send an appointment request. Treatment prices and any applicable policies can be discussed directly with the team.'],
  ['What if I’m not sure which treatment to choose?', 'Select “Help me choose” when booking. Tell us a little about the experience you’re looking for, and discuss suitable options with the team before deciding.'],
  ['Can I change my appointment request?', 'Call 365-833-0170 and quote the reference from your request. The team can help you discuss a new date, change a treatment or cancel your request.'],
];

function Flower({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.2">{[0,45,90,135].map(r => <ellipse key={r} cx="50" cy="50" rx="14" ry="46" transform={'rotate('+r+' 50 50)'} />)}<circle cx="50" cy="50" r="8" /></g></svg>;
}

export default function Spa({journal, bookingOnly=false, serviceRequest}:{journal?:ReactNode;bookingOnly?:boolean;serviceRequest?:{id:string;key:number}}) {
  const [menu,setMenu]=useState(false);
  const [paused,setPaused]=useState(false);
  const [activeCategory,setActiveCategory]=useState('All experiences');
  const [service,setService]=useState('facial');
  const [step,setStep]=useState(1);
  const [date,setDate]=useState('');
  const [time,setTime]=useState('');
  const [month,setMonth]=useState('');
  const [today,setToday]=useState('');
  const [limit,setLimit]=useState('');
  const [nowTime,setNowTime]=useState('');
  const [openFaq,setOpenFaq]=useState<number|null>(0);
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState('');
  const [receipt,setReceipt]=useState('');
  const [privacy,setPrivacy]=useState(false);
  const [contact,setContact]=useState({name:'',email:'',phone:'',notes:'',consent:false,website:''});
  const requestId=useRef('');
  const privacyDialog=useRef<HTMLDialogElement>(null);
  const heading=useRef<HTMLHeadingElement>(null);
  const hasNavigated=useRef(false);
  const chosen=services.find(s=>s.id===service)!;

  useEffect(()=>{
    const update=()=>{ const n=torontoNow(); setToday(n.date);setNowTime(n.time);setLimit(lastBookingDate()); };
    update();setMonth(torontoNow().date.slice(0,7));requestId.current=crypto.randomUUID();
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(media.matches);
    const tick=setInterval(update,30000);
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);} }),{threshold:.12});
    document.querySelectorAll('[data-reveal]').forEach(e=>observer.observe(e));
    let raf=0;
    const scroll=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{document.documentElement.style.setProperty('--scroll',String(window.scrollY));document.documentElement.style.setProperty('--progress',(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100)+'%');});};
    window.addEventListener('scroll',scroll,{passive:true});
    return ()=>{clearInterval(tick);observer.disconnect();cancelAnimationFrame(raf);window.removeEventListener('scroll',scroll);};
  },[]);
  useEffect(()=>{ document.documentElement.dataset.motion=paused?'off':'on'; },[paused]);
  useEffect(()=>{ if(hasNavigated.current) heading.current?.focus({preventScroll:true}); },[step,receipt]);
  useEffect(()=>{ if(privacy)privacyDialog.current?.showModal();else privacyDialog.current?.close(); },[privacy]);

  useEffect(()=>{
    if(serviceRequest && services.some(s=>s.id===serviceRequest.id)) {
      setService(serviceRequest.id);setStep(2);setReceipt('');setError('');
      requestId.current=crypto.randomUUID();
    }
  },[serviceRequest]);

  function goStep(n:number){hasNavigated.current=true;setError('');setStep(n);}
  function pickService(id:string){setService(id);goStep(2);setReceipt('');document.getElementById('booking')?.scrollIntoView({behavior:paused?'instant':'smooth'});}
  function moveMonth(delta:number){const d=new Date(month+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+delta);setMonth(d.toISOString().slice(0,7));}
  async function submit(e:FormEvent){
    e.preventDefault();if(submitting)return;setError('');
    if(!validSlot(date,time)){setError('That time has passed. Please choose another date and time.');goStep(2);return;}
    setSubmitting(true);
    try{
      const response=await fetch('/api/appointments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:requestId.current,service,date,time,...contact})});
      const data=await response.json() as {error?:string;reference:string};
      if(!response.ok)throw new Error(data.error||'Please try again.');
      setReceipt(data.reference);
    }catch(e){setError(e instanceof Error?e.message:'We could not save your request. Please try again.');}
    finally{setSubmitting(false);}
  }
  function downloadReceipt(){
    const text=['Slimmer You & Pamper Spa','APPOINTMENT REQUEST — PENDING CONFIRMATION','Reference: '+receipt,'Treatment: '+chosen.name,'Preferred date: '+prettyDate(date),'Preferred time: '+prettyTime(time)+' (America/Toronto)','This is a request, not a confirmed appointment.','Call 365-833-0170 to confirm.','609 Upper Wellington Street, Hamilton, ON'].join('\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='spa-appointment-request.txt';a.click();URL.revokeObjectURL(url);
  }
  const filtered=activeCategory==='All experiences'?services.slice(0,3):services.filter(s=>activeCategory==='Face & glow'?s.id==='facial':activeCategory==='Body & balance'?s.id==='body'||s.id==='wellness':s.id==='massage'||s.id==='hair');
  const start=month?new Date(month+'-01T12:00:00Z').getUTCDay():0;
  const days=month?new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate():0;

  const bookingSection = (<section className="booking-section section" id="booking">
        <div className="booking-intro" data-reveal><p className="eyebrow">03 / SAVE A LITTLE TIME FOR YOU</p><h2>Your next<br/><em>feel-good</em><br/>moment.</h2><p>Choose your treatment and preferred time.<br/>A little self-care starts right here.</p><div className="booking-facts"><span><Check size={16}/>No payment or card required</span><span><CalendarDays size={16}/>Preferred times: 9 a.m.–5 p.m.</span><span><MapPin size={16}/>Hamilton, Ontario · Eastern Time</span></div><div className="booking-call"><span>Prefer a friendly voice?</span><a href="tel:+13658330170">365 833 0170 <ArrowUpRight size={17}/></a></div><Flower className="booking-flower"/></div>
        <div className="booking-panel">
          {!receipt?<><div className="steps">{['Treatment','Date & time','Your details'].map((s,i)=><button key={s} disabled={i+1>step} className={step===i+1?'current':step>i+1?'complete':''} onClick={()=>goStep(i+1)}><span>{step>i+1?<Check size={13}/>:i+1}</span>{s}</button>)}</div>
          <div className="step-content" key={step}>
            <div className="booking-heading"><div><span className="eyebrow">STEP 0{step} OF 03</span><h3 ref={heading} tabIndex={-1}>{step===1?'What feels good today?':step===2?'Pick your little pause.':'Let’s make it personal.'}</h3></div><span className="small-flower">✳</span></div>
            {step===1?<><p className="muted">Choose an experience. We’ll confirm the details together.</p><div className="service-choices">{services.map(s=><button key={s.id} className={service===s.id?'selected':''} onClick={()=>setService(s.id)} aria-pressed={service===s.id}><span><strong>{s.name}</strong><small>{s.tags}</small></span><span className="radio-dot">{service===s.id&&<span/>}</span></button>)}</div><button className="button wide" onClick={()=>goStep(2)}>Choose date & time <ArrowRight size={18}/></button></>:null}
            {step===2?<><div className="selection-chip"><Sparkles size={14}/>{chosen.name}<button onClick={()=>goStep(1)}>Change</button></div><div className="calendar-toolbar"><button aria-label="Previous month" disabled={!month||month<=today.slice(0,7)} onClick={()=>moveMonth(-1)}><ChevronLeft size={19}/></button><strong aria-live="polite">{month?new Date(month+'-01T12:00:00Z').toLocaleDateString('en-CA',{month:'long',year:'numeric',timeZone:'UTC'}):'Loading calendar…'}</strong><button aria-label="Next month" disabled={!month||month>=limit.slice(0,7)} onClick={()=>moveMonth(1)}><ChevronRight size={19}/></button></div>
              <div className="calendar-grid">{['S','M','T','W','T','F','S'].map((d,i)=><span className="weekday" key={'week'+i}>{d}</span>)}{Array.from({length:start},(_,i)=><span key={'blank'+i}/>)}{Array.from({length:days},(_,i)=>{const v=month+'-'+String(i+1).padStart(2,'0');return <button key={v} disabled={v<today||v>limit||(v===today&&nowTime>='16:30')} aria-label={prettyDate(v)} aria-pressed={date===v} className={(date===v?'selected ':'')+(today===v?'today':'')} onClick={()=>{setDate(v);setTime('');}}>{i+1}</button>;})}</div>
              <div className="time-label"><strong>{date?'Preferred time':'Choose a date to see times'}</strong><span>Eastern Time · Toronto</span></div><div className="time-grid">{date?times.map(t=><button key={t} disabled={date===today&&t<=nowTime} className={time===t?'selected':''} aria-pressed={time===t} onClick={()=>setTime(t)}>{prettyTime(t)}</button>):<p className="date-placeholder"><CalendarDays size={20}/>Your calendar deserves some self-care.</p>}</div><p className="booking-notice">These are preferred times, subject to spa confirmation.</p><button className="button wide" disabled={!date||!time||!validSlot(date,time)} onClick={()=>goStep(3)}>Continue to your details <ArrowRight size={18}/></button>
            </>:null}
            {step===3?<form onSubmit={submit}><div className="request-summary"><span><strong>{chosen.name}</strong><small>{prettyDate(date)} · {prettyTime(time)} ET</small></span><button type="button" className="text-link" onClick={()=>goStep(2)}>Edit</button></div><div className="form-fields"><label>Full name<input autoComplete="name" required minLength={2} maxLength={100} value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} placeholder="Your name"/></label><label>Email address<input autoComplete="email" type="email" required maxLength={254} value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})} placeholder="you@example.com"/></label><label>Phone number<input autoComplete="tel" type="tel" required minLength={7} maxLength={30} pattern="[+0-9 ()\-\.]{7,30}" value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})} placeholder="(365) 000-0000"/></label><label>A little note <span>(optional)</span><textarea maxLength={500} value={contact.notes} onChange={e=>setContact({...contact,notes:e.target.value})} placeholder="Anything you’d like us to know about your visit? Please leave out medical details." rows={3}/></label><label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={contact.website} onChange={e=>setContact({...contact,website:e.target.value})}/></label></div><label className="consent"><input type="checkbox" required checked={contact.consent} onChange={e=>setContact({...contact,consent:e.target.checked})}/><span>I agree that the spa may use these details to arrange my appointment. I understand this is a request, pending confirmation.</span></label><button className="privacy-link" type="button" onClick={()=>setPrivacy(true)}>How your details are used</button>{error?<p role="alert" className="error">{error}</p>:null}<button className="button wide" type="submit" disabled={submitting}>{submitting?'Saving your request…':'Request my appointment'}{!submitting&&<ArrowUpRight size={19}/>}</button><p className="booking-notice">No payment today. Your time is confirmed directly with the spa.</p></form>:null}
          </div></>:<div className="receipt"><div className="success-mark"><Check size={34} strokeWidth={1.4}/></div><p className="eyebrow">A LITTLE SELF-CARE IS ON ITS WAY</p><h3 ref={heading} tabIndex={-1}>Your request<br/>is <em>saved.</em></h3><span className="pending-label">PENDING CONFIRMATION</span><p>{chosen.name}<br/>{prettyDate(date)} · {prettyTime(time)} ET</p><p className="muted">This is an appointment request. Please call the spa to confirm your time before visiting. No email or text confirmation has been sent.</p><div className="reference">YOUR REFERENCE<strong>{receipt}</strong></div><a className="button wide" href="tel:+13658330170">Call to confirm <Phone size={17}/></a><button className="text-link download-receipt" onClick={downloadReceipt}>Save request details <ArrowDown size={16}/></button><button className="new-request" onClick={()=>{setReceipt('');goStep(1);requestId.current=crypto.randomUUID();setDate('');setTime('');setContact({name:'',email:'',phone:'',notes:'',consent:false,website:''});}}>Make another request</button></div>}
        </div>
      </section>);
  const privacyModal = (<dialog ref={privacyDialog} onCancel={()=>setPrivacy(false)} onClick={e=>{if(e.target===e.currentTarget)setPrivacy(false);}} className="privacy-dialog"><button className="dialog-close" aria-label="Close privacy notice" onClick={()=>setPrivacy(false)}><X/></button><p className="eyebrow">YOUR DETAILS, WITH CARE</p><h2>Appointment privacy</h2><p>When you request an appointment, your name, email, phone number, preferred treatment, date, time and any note are stored in the website’s booking database for handling your request.</p><p>Only share information needed to arrange your visit. Please do not include medical information. No payment information is collected, and submitting this form does not subscribe you to marketing.</p><p>To ask about your request or request deletion of your details, contact Slimmer You & Pamper Spa at <a href="tel:+13658330170">365-833-0170</a>.</p><p>Editorial photography is used alongside photographs of our spa. It does not show treatment results.</p><button className="button" onClick={()=>setPrivacy(false)}>Got it <Check size={16}/></button></dialog>);
  if(bookingOnly) return <>{bookingSection}{privacyModal}</>;

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <div className="reading-progress" />
    <div className="announcement"><span>A little time for yourself goes a long way.</span><a href="#booking">Find your moment <ArrowUpRight size={13}/></a></div>
    <header className="header">
      <a className="wordmark" href="#" aria-label="Slimmer You & Pamper Spa home"><span>slimmer you<span className="wordmark-flower">✳</span></span><small>& PAMPER SPA</small></a>
      <nav className={menu?'nav is-open':'nav'} aria-label="Main navigation">
        {[['Treatments','#treatments'],['The experience','#experience'],['The journal','/blog'],['Visit us','#visit']].map(([label,url])=><a key={url} href={url} onClick={()=>setMenu(false)}>{label}</a>)}
        <a className="mobile-book" href="#booking" onClick={()=>setMenu(false)}>Book your moment <ArrowUpRight size={16}/></a>
      </nav>
      <div className="header-actions"><button className="motion-toggle" aria-label={paused?'Enable animations':'Pause animations'} title={paused?'Enable animations':'Pause animations'} onClick={()=>setPaused(!paused)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button><a className="button nav-book" href="#booking">Book your moment <ArrowUpRight size={16}/></a><button className="menu-toggle" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
    </header>
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow hero-enter"><span className="tiny-star">✳</span> SPA & BODY CARE IN HAMILTON, ONTARIO</div>
          <h1><span>A little pause.</span><span>A whole new</span><span className="last-line"><em>you.</em><span className="hero-flower"><Flower/></span></span></h1>
          <p className="hero-description hero-enter">Less rush. More radiance. Body, skin and soul care<br className="desktop-break"/> that brings you back to yourself.</p>
          <div className="hero-buttons hero-enter"><a className="button" href="#booking">Make time for you <ArrowUpRight size={19}/></a><a className="text-link" href="#treatments">Explore treatments <ArrowDown size={15}/></a></div>
          <div className="hero-foot hero-enter"><span><MapPin size={14}/> YOUR LITTLE ESCAPE IN HAMILTON, ON</span><a href="#treatments" aria-label="Scroll to treatments"><ArrowDown size={17}/></a></div>
        </div>
        <div className="hero-visual">
          <img className="hero-image" src="/images/facial-editorial.jpg" alt="A peaceful moment during a facial treatment" fetchPriority="high"/>
          <div className="image-shade"/>
          <span className="image-caption">THE ART OF FEELING GOOD.</span>
          <div className="round-seal"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="circle-text" d="M60,60m-44,0a44,44 0 1,1 88,0a44,44 0 1,1 -88,0"/></defs><text><textPath href="#circle-text">RELAX • REVIVE • RENEW • RELAX • REVIVE • RENEW • </textPath></text></svg><Flower/></div>
          <a href="#booking" className="photo-note"><span className="note-icon"><Heart size={20} strokeWidth={1.3}/></span><span>A moment that’s just yours.<small>No online payment. Just a little self-care.</small></span><ArrowUpRight size={19}/></a>
        </div>
      </section>
      <div className="marquee" aria-label="Relax. Revive. Renew."><div className="marquee-track">{Array.from({length:6},(_,i)=><span key={i} aria-hidden={i>0}>RELAX <span>✳</span> REVIVE <span>✳</span> RENEW <span>✳</span></span>)}</div></div>

      <section className="treatments section" id="treatments">
        <div className="section-top" data-reveal><div><p className="eyebrow">01 / YOUR SELF-CARE MENU</p><h2>Good for your body.<br/><em>Beautiful for your soul.</em></h2></div><p className="section-intro">A little glow, a deeper exhale, a fresh start.<br/>Find the experience that feels like you.</p></div>
        <div className="filter-tabs" aria-label="Filter treatments">{['All experiences','Face & glow','Body & balance','Relax & refresh'].map(t=><button key={t} aria-pressed={activeCategory===t} className={activeCategory===t?'active':''} onClick={()=>setActiveCategory(t)}>{t}</button>)}</div>
        <div className="treatment-grid" key={activeCategory}>{filtered.map((s,i)=><article className="treatment-card" key={s.id} style={{animationDelay:i*90+'ms'}}>
          <button className="treatment-photo" onClick={()=>pickService(s.id)} aria-label={'Request '+s.name}><img loading="lazy" src={s.image} alt={s.alt}/><span className="photo-tag">{s.category}</span><span className="circle-arrow"><ArrowUpRight size={23}/></span></button>
          <div className="treatment-title"><h3>{s.name}</h3><span>0{i+1}</span></div><p>{s.description}</p><span className="treatment-tags">{s.tags}</span>
        </article>)}</div>
        <div className="treatment-bottom"><span>New to self-care? We’ll help you find your starting point.</span><button className="text-link" onClick={()=>pickService('consultation')}>Let’s find your fit <ArrowUpRight size={18}/></button></div>
      </section>

      <section className="experience" id="experience">
        <div className="experience-visual" data-reveal><img src="/images/facial-treatment.jpg" alt="Facial care at Slimmer You & Pamper Spa in Hamilton" loading="lazy"/><div className="vertical-label">REAL MOMENTS, AT OUR HAMILTON SPA</div><div className="experience-photo-note"><Flower/><span>Come as you are.<br/><em>Leave a little lighter.</em></span></div></div>
        <div className="experience-copy" data-reveal><p className="eyebrow">02 / MORE THAN A TREATMENT</p><h2>A softer pace.<br/>A space for <em>you.</em></h2><p>At Slimmer You & Pamper Spa, we believe there’s something special about pressing pause. A quiet moment. A caring touch. The chance to put yourself first.</p><p>From body contouring to skin care and relaxing rituals, discover your own kind of self-care here in Hamilton.</p><div className="experience-values"><span><Leaf size={22} strokeWidth={1.2}/>Care that feels personal</span><span><Sparkles size={22} strokeWidth={1.2}/>Space to slow down</span></div><a className="button light" href="#booking">Your moment starts here <ArrowUpRight size={19}/></a></div>
      </section>

      <section className="ritual-section section" data-reveal><span className="eyebrow">A GENTLE REMINDER</span><h2>You don’t need a reason<br/>to take care of <em>yourself.</em></h2><Flower className="ritual-flower"/><p>Make a little space in your calendar. We’ll meet you there.</p></section>

      {bookingSection}

      <section className="faq-section section" data-reveal><div><p className="eyebrow">A FEW THINGS TO KNOW</p><h2>A little clarity.<br/><em>A lot more calm.</em></h2><a className="text-link" href="tel:+13658330170">Talk to our team <ArrowUpRight size={18}/></a></div><div className="faqs">{faqs.map(([q,a],i)=><div className={'faq '+(openFaq===i?'expanded':'')} key={q}><button aria-expanded={openFaq===i} aria-controls={'faq-'+i} onClick={()=>setOpenFaq(openFaq===i?null:i)}>{q}{openFaq===i?<Minus size={18}/>:<Plus size={18}/>}</button><div id={'faq-'+i} className="faq-answer" hidden={openFaq!==i}><p>{a}</p></div></div>)}</div></section>

      {journal}

      <section className="visit-section" id="visit"><div className="visit-photo"><img src="/images/our-spa.jpg" alt="A gathering at Slimmer You & Pamper Spa in Hamilton" loading="lazy"/><a href={ig} target="_blank" rel="noreferrer"><Instagram size={18}/>A little look inside <ArrowUpRight size={19}/></a></div><div className="visit-copy" data-reveal><p className="eyebrow">04 / YOUR NEIGHBOURHOOD ESCAPE</p><h2>A little closer<br/>to <em>feeling good.</em></h2><p>Find us on Upper Wellington Street.<br/>Your moment of calm is waiting.</p><div className="visit-details"><div><span>FIND YOUR WAY</span><a href={maps} target="_blank" rel="noreferrer">609 Upper Wellington Street<br/>Hamilton, ON L9A 3P8 <ArrowUpRight size={16}/></a></div><div><span>LET’S CONNECT</span><a href="tel:+13658330170">365 833 0170</a><a href={ig} target="_blank" rel="noreferrer">@slimmeryoupamperspa</a></div></div><a className="button" href={maps} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={19}/></a></div></section>
      <section className="last-cta"><p className="eyebrow">YOU DESERVE TO FEEL GOOD.</p><a href="#booking">Shall we make<br/><em>time for you?</em><span><ArrowUpRight strokeWidth={1}/></span></a></section>
    </main>
    <footer><a className="wordmark" href="#"><span>slimmer you<span className="wordmark-flower">✳</span></span><small>& PAMPER SPA</small></a><p>Relax. Revive. Renew.</p><div><button onClick={()=>setPrivacy(true)}>Privacy</button><a href={ig} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18}/></a><a href="tel:+13658330170" aria-label="Call the spa"><Phone size={17}/></a></div><small>© {today?today.slice(0,4):'2026'} Slimmer You & Pamper Spa</small></footer>
    {privacyModal}
  </>;
}
