import { getChatGPTUser } from "../../chatgpt-auth";

const OWNER="wallissonghost@gmail.com";
const defaults=[
  {id:"flash",slug:"deu-flash",label:"DEU FLASH",description:"Fotografia, festas e acontecimentos registrados em destaque.",href:"/categoria/deu-flash",position:0,active:1},
  {id:"historia",slug:"deu-historia",label:"DEU HISTÓRIA",description:"Entrevistas e trajetórias que merecem ser conhecidas.",href:"/categoria/deu-historia",position:1,active:1},
  {id:"negocio",slug:"deu-negocio",label:"DEU NEGÓCIO",description:"Empresas, marcas e empreendedores que movimentam ideias.",href:"/categoria/deu-negocio",position:2,active:1},
  {id:"estilo",slug:"deu-estilo",label:"DEU ESTILO",description:"Moda, beleza, identidade e expressão.",href:"/categoria/deu-estilo",position:3,active:1},
  {id:"gente",slug:"deu-gente",label:"DEU GENTE",description:"Personalidades, criadores e talentos em evidência.",href:"/categoria/deu-gente",position:4,active:1},
  {id:"agenda",slug:"deu-agenda",label:"DEU AGENDA",description:"Os próximos eventos e experiências da cidade.",href:"/categoria/deu-agenda",position:5,active:1},
];

async function setup(){const {env}=await import("cloudflare:workers");await env.DB.batch([
  env.DB.prepare("CREATE TABLE IF NOT EXISTS editorial_categories (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, label TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', href TEXT NOT NULL, position INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1)"),
  env.DB.prepare("CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)"),
]);const count:any=await env.DB.prepare("SELECT COUNT(*) AS total FROM editorial_categories").first();if(!count?.total)await env.DB.batch(defaults.map(x=>env.DB.prepare("INSERT INTO editorial_categories (id,slug,label,description,href,position,active) VALUES (?,?,?,?,?,?,?)").bind(x.id,x.slug,x.label,x.description,x.href,x.position,x.active)));return env;}

async function admin(){const user=await getChatGPTUser();return user?.email.toLowerCase()===OWNER;}

export async function GET(request:Request){const env=await setup();const all=new URL(request.url).searchParams.get("all")==="1";if(all&&!(await admin()))return Response.json({error:"Não autorizado"},{status:401});const rows:any=await env.DB.prepare(`SELECT * FROM editorial_categories ${all?"":"WHERE active=1"} ORDER BY position`).all();const speed:any=await env.DB.prepare("SELECT value FROM site_settings WHERE key='ticker_speed'").first();return Response.json({items:rows.results.map((x:any)=>({...x,active:Boolean(x.active)})),speed:Number(speed?.value||28)});}

export async function POST(request:Request){if(!(await admin()))return Response.json({error:"Não autorizado"},{status:401});const env=await setup();const data:any=await request.json();const items=Array.isArray(data.items)?data.items:[];if(items.length)await env.DB.batch(items.map((x:any,i:number)=>env.DB.prepare("INSERT INTO editorial_categories (id,slug,label,description,href,position,active) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,label=excluded.label,description=excluded.description,href=excluded.href,position=excluded.position,active=excluded.active").bind(x.id||crypto.randomUUID(),x.slug||`categoria-${i+1}`,x.label||"NOVA CATEGORIA",x.description||"",x.href||`/categoria/${x.slug}`,i,x.active?1:0)));const speed=Math.max(8,Math.min(90,Number(data.speed)||28));await env.DB.prepare("INSERT INTO site_settings (key,value) VALUES ('ticker_speed',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(String(speed)).run();return Response.json({ok:true});}
