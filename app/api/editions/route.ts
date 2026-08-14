import { getChatGPTUser } from "../../chatgpt-auth";

const OWNER = "wallissonghost@gmail.com";
const getEnv = async () => (await import("cloudflare:workers")).env;

async function ensureSchema() {
  const env = await getEnv();
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS editions (id TEXT PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft', cover_image TEXT NOT NULL DEFAULT '', created_by TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS magazine_pages (id TEXT PRIMARY KEY, edition_id TEXT NOT NULL, position INTEGER NOT NULL, label TEXT NOT NULL DEFAULT 'EDITORIAL', title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', image_url TEXT NOT NULL DEFAULT '', layout TEXT NOT NULL DEFAULT 'editorial')"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS pages_edition_position_idx ON magazine_pages (edition_id, position)"),
  ]);
}

async function isAdmin() {
  const user = await getChatGPTUser();
  return user?.email.toLowerCase() === OWNER;
}

export async function GET(request: Request) {
  await ensureSchema();
  const env = await getEnv();
  const publicOnly = new URL(request.url).searchParams.get("public") === "1";
  if (!publicOnly && !(await isAdmin())) return Response.json({error:"Não autorizado"},{status:401});
  const editions = await env.DB.prepare(`SELECT * FROM editions ${publicOnly ? "WHERE status = 'published'" : ""} ORDER BY updated_at DESC`).all();
  const pages = await env.DB.prepare("SELECT * FROM magazine_pages ORDER BY edition_id, position").all();
  const list = editions.results.map((edition:any)=>({
    ...edition,
    coverImage: edition.cover_image,
    pages: pages.results.filter((page:any)=>page.edition_id===edition.id).map((page:any)=>({...page,editionId:page.edition_id,imageUrl:page.image_url})),
  }));
  return Response.json(list);
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || user.email.toLowerCase() !== OWNER) return Response.json({error:"Não autorizado"},{status:401});
  await ensureSchema();
  const env = await getEnv();
  const data:any = await request.json();
  const id = data.id || crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare("INSERT INTO editions (id,title,subtitle,status,cover_image,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,subtitle=excluded.subtitle,status=excluded.status,cover_image=excluded.cover_image,updated_at=excluded.updated_at")
    .bind(id,data.title||"Nova edição",data.subtitle||"",data.status==="published"?"published":"draft",data.coverImage||"",user.email,now,now).run();
  await env.DB.prepare("DELETE FROM magazine_pages WHERE edition_id = ?").bind(id).run();
  const pages = Array.isArray(data.pages)?data.pages:[];
  if(pages.length) await env.DB.batch(pages.map((page:any,index:number)=>env.DB.prepare("INSERT INTO magazine_pages (id,edition_id,position,label,title,body,image_url,layout) VALUES (?,?,?,?,?,?,?,?)").bind(page.id||crypto.randomUUID(),id,index,page.label||"EDITORIAL",page.title||`Página ${index+1}`,page.body||"",page.imageUrl||"",page.layout||"editorial")));
  return Response.json({ok:true,id});
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({error:"Não autorizado"},{status:401});
  await ensureSchema();
  const env = await getEnv();
  const id = new URL(request.url).searchParams.get("id");
  if(!id) return Response.json({error:"ID obrigatório"},{status:400});
  await env.DB.batch([env.DB.prepare("DELETE FROM magazine_pages WHERE edition_id = ?").bind(id),env.DB.prepare("DELETE FROM editions WHERE id = ?").bind(id)]);
  return Response.json({ok:true});
}
