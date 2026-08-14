import {notFound} from "next/navigation";
import ShareButtons from "../../materia/[id]/ShareButtons";
import "../../materia/[id]/article.css";
import "./published-article.css";

export const dynamic="force-dynamic";

export default async function PublishedArticle({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const {env}=await import("cloudflare:workers");
  const now=new Date().toISOString();
  const article:any=await env.DB.prepare("SELECT * FROM articles WHERE slug=? AND (status='published' OR (status='scheduled' AND scheduled_at<=?))").bind(slug,now).first();
  if(!article)notFound();
  const related:any=await env.DB.prepare("SELECT slug,title,category,cover_image FROM articles WHERE id<>? AND (status='published' OR (status='scheduled' AND scheduled_at<=?)) ORDER BY featured DESC,updated_at DESC LIMIT 3").bind(article.id,now).all();
  const paragraphs=String(article.body||"").split(/\n\s*\n/).map((text:string)=>text.trim()).filter(Boolean);
  const instagram=String(article.instagram||"").replace(/^@/,"");
  const contact=String(article.contact||"");
  const whatsapp=contact.replace(/\D/g,"");
  return <main className="articlePage publishedArticle">
    <header><a className="articleBrand" href="/"><b>DEU CAPA.</b><span>QUEM ACONTECE, APARECE.</span></a><nav><a href="/editorial">EDITORIAL</a><a href="/divulgue">QUERO APARECER</a></nav></header>
    <section className="articleHero" style={{backgroundImage:`url(${article.cover_image})`}}><div className="articleShade"/><div><p>{article.category} • EM EVIDÊNCIA</p><h1>{article.title}</h1>{article.subtitle&&<h2>{article.subtitle}</h2>}<span>POR {String(article.author).toUpperCase()} <i/> DEU CAPA. EDITORIAL</span></div></section>
    <article className="articleBody"><aside><p>PERSONAGEM / ASSUNTO</p><h3>{article.subject||article.category}</h3><div className="articleContacts">{instagram&&<a href={`https://instagram.com/${instagram}`} target="_blank">INSTAGRAM ↗</a>}{whatsapp&&<a href={`https://wa.me/${whatsapp}`} target="_blank">CONTATO ↗</a>}</div><ShareButtons title={article.title}/></aside><div className="articleText">{paragraphs.length?paragraphs.map((p:string,i:number)=><p className={i===0?"lead":""} key={i}>{p}</p>):<p className="lead">Uma história selecionada pela curadoria da DEU CAPA. para inspirar, conectar e colocar novos nomes em evidência.</p>}<blockquote>Quem acontece, aparece.</blockquote></div></article>
    {related.results.length>0&&<section className="related"><p>CONTINUE LENDO</p><h2>Mais histórias em evidência</h2><div>{related.results.map((item:any)=><a key={item.slug} href={`/artigo/${item.slug}`}><figure style={{backgroundImage:`url(${item.cover_image})`}}/><small>{item.category}</small><h3>{item.title}</h3><span>LER MATÉRIA ↗</span></a>)}</div></section>}
    <footer><b>DEU CAPA.</b><p>Quem acontece, aparece.</p><a href="/">VOLTAR AO INÍCIO ↑</a></footer>
  </main>
}
