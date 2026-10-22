import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { posts, readMinutes, type BlogPost } from './posts';
export function BlogHeader() {
  return <><a href="#main" className="skip-link">Skip to content</a><div className="announcement"><span>A little time for yourself goes a long way.</span><a href="/#booking">Find your moment <ArrowUpRight size={13}/></a></div><header className="header journal-header"><a className="wordmark" href="/" aria-label="Slimmer You & Pamper Spa home"><span>slimmer you<span className="wordmark-flower">✳</span></span><small>& PAMPER SPA</small></a><nav aria-label="Main navigation" className="journal-nav"><a href="/#treatments">Treatments</a><a href="/blog" aria-current="location">The journal</a><a className="button" href="/#booking">Book a moment <ArrowUpRight size={16}/></a></nav></header></>;
}
export function PostCard({post}:{post:BlogPost}) {
  return <article className="journal-card"><a className="journal-card-image" href={'/blog/'+post.slug}><img loading="lazy" src={post.image} alt={post.imageAlt}/><span className="photo-tag">{post.category}</span><span className="circle-arrow"><ArrowUpRight size={22}/></span></a><div className="journal-card-meta">{readMinutes(post)} MIN READ <span>•</span> THE SELF-CARE JOURNAL</div><h3><a href={'/blog/'+post.slug}>{post.title}</a></h3><p>{post.description}</p><a className="text-link" href={'/blog/'+post.slug}>Read the story <ArrowRight size={15}/><span className="sr-only">: {post.title}</span></a></article>;
}
export function JournalPreview() {
  return <section className="section journal-preview" id="journal"><div className="section-top"><div><p className="eyebrow">THE SELF-CARE JOURNAL</p><h2>A little inspiration.<br/><em>A moment to read.</em></h2></div><a className="text-link" href="/blog">Explore the journal <ArrowUpRight size={18}/></a></div><div className="journal-grid">{posts.slice(0,3).map(post=><PostCard key={post.slug} post={post}/>)}</div></section>;
}
export function BlogFooter() {
  return <footer className="journal-footer"><a className="wordmark" href="/"><span>slimmer you<span className="wordmark-flower">✳</span></span><small>& PAMPER SPA</small></a><address>609 Upper Wellington Street<br/>Hamilton, ON L9A 3P8</address><div><a href="/blog">The journal</a><a href="tel:+13658330170">365 833 0170</a><a href="/#booking">Request an appointment ↗</a></div><small>© 2026 Slimmer You & Pamper Spa · Relax. Revive. Renew.</small></footer>;
}
