export const services = [
  { id: 'facial', name: 'Facials & skin care', category: 'THE GLOW', description: 'Make room for a fresh-faced moment. Explore facial care and skin rejuvenation with a treatment chosen around you.', image: '/images/facial-editorial.jpg', alt: 'A relaxing facial treatment', tags: 'Facials · Skin rejuvenation' },
  { id: 'body', name: 'Body contouring', category: 'THE CONFIDENCE', description: 'A thoughtful approach to your personal goals. Discover non-invasive body contouring and fat-freeze treatments.', image: '/images/body-contouring.webp', alt: 'Non-invasive body contouring treatment', tags: 'Body contouring · Fat freeze' },
  { id: 'massage', name: 'Massage & relaxation', category: 'THE EXHALE', description: 'Set the busy world aside for a while. Take time for relaxing massage, therapeutic massage and lymphatic techniques.', image: '/images/massage.jpg', alt: 'A calming massage ritual', tags: 'Relaxation · Therapeutic massage' },
  { id: 'wellness', name: 'Wellness rituals', category: 'THE RESET', description: 'Discover foot detox, sauna tent and red light therapy. Ask our team which experience is right for your visit.', image: '/images/ritual.jpg', alt: 'Spa oils and botanical self-care essentials', tags: 'Foot detox · Sauna · Red light' },
  { id: 'hair', name: 'Hair & finishing touches', category: 'THE FINISH', description: 'A little finishing touch for your day. Ask about haircuts, blow dries and styling when planning your visit.', image: '/images/our-spa.jpg', alt: 'Guests enjoying the Hamilton spa', tags: 'Haircuts · Blow dry · Styling' },
  { id: 'consultation', name: 'Help me choose', category: 'YOUR FIRST VISIT', description: 'Not sure where to start? Request a conversation with the team about your goals and available treatments.', image: '/images/our-spa.jpg', alt: 'Inside Slimmer You & Pamper Spa', tags: 'A personal introduction' },
] as const;
export const times = Array.from({ length: 16 }, (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);
export function torontoNow(now = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = (key: string) => p.find(v => v.type === key)!.value;
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` };
}
export function lastBookingDate(now = new Date()) { const d = new Date(torontoNow(now).date+'T12:00:00Z'); d.setUTCDate(d.getUTCDate()+90); return d.toISOString().slice(0,10); }
export function validSlot(date: string, time: string, now = new Date()) {
  const current = torontoNow(now); const parsed = new Date(date+'T12:00:00Z');
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === date && date >= current.date && date <= lastBookingDate(now) && times.includes(time) && (date !== current.date || time > current.time);
}
export function prettyTime(time: string) { const [h,m] = time.split(':'); return `${Number(h)%12 || 12}:${m} ${Number(h)<12?'AM':'PM'}`; }
export function prettyDate(date: string) { return new Date(date+'T12:00:00Z').toLocaleDateString('en-CA', { month:'long', day:'numeric', year:'numeric', timeZone:'UTC' }); }
