import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { services, validSlot } from '../../booking-data';
const schema = z.object({
  id: z.string().uuid(), name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform(v=>v.toLowerCase()),
  phone: z.string().trim().min(7).max(30).regex(/^[+\d\s().-]+$/).refine(v=>v.replace(/\D/g,'').length>=7),
  service: z.string().refine(v=>services.some(s=>s.id===v)), date: z.string(), time: z.string(),
  notes: z.string().trim().max(500).default(''), consent: z.literal(true), website: z.string().max(0).default(''),
});
const headers = { 'Cache-Control': 'no-store' };
export async function POST(request: Request) {
  try {
    const origin=request.headers.get('origin');
    if(origin && origin!==new URL(request.url).origin) return Response.json({error:'Please submit from the spa website.'},{status:403,headers});
    if(Number(request.headers.get('content-length')||0)>8192) return Response.json({error:'Request is too large.'},{status:413,headers});
    const raw=await request.text();
    if(raw.length>8192) return Response.json({error:'Request is too large.'},{status:413,headers});
    let parsed; try { parsed=JSON.parse(raw); } catch { return Response.json({error:'Please check your request.'},{status:400,headers}); }
    const result=schema.safeParse(parsed);
    if(!result.success) return Response.json({error:'Please check your contact details and consent.'},{status:400,headers});
    const d=result.data;
    if(!validSlot(d.date,d.time)) return Response.json({error:'Please choose a future time within the next 90 days, between 9 a.m. and 5 p.m.'},{status:400,headers});
    if(!env.DB) throw new Error('Missing booking database');
    const existing=await env.DB.prepare('SELECT id, email FROM appointment_requests WHERE id = ?').bind(d.id).first<{id:string,email:string}>();
    if(existing) return existing.email===d.email ? Response.json({reference:existing.id,status:'pending'},{headers}) : Response.json({error:'Please refresh and try again.'},{status:409,headers});
    const now=new Date().toISOString(); const since=new Date(Date.now()-24*60*60*1000).toISOString();
    const saved=await env.DB.prepare(`INSERT INTO appointment_requests (id,name,email,phone,service,preferred_date,preferred_time,notes,status,consent_version,created_at) SELECT ?,?,?,?,?,?,?,?,'pending','2026-10-22',? WHERE (SELECT COUNT(*) FROM appointment_requests WHERE email = ? AND created_at >= ?) < 4 ON CONFLICT(id) DO NOTHING`).bind(d.id,d.name,d.email,d.phone,d.service,d.date,d.time,d.notes,now,d.email,since).run();
    if(!saved.meta.changes) return Response.json({error:'A request may already be saved, or you have reached the daily limit. Please call 365-833-0170 for help.'},{status:429,headers});
    return Response.json({reference:d.id,status:'pending'},{status:201,headers});
  } catch { return Response.json({error:'We could not save your request. Please try again or call 365-833-0170.'},{status:503,headers}); }
}
