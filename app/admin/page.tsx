import { redirect } from "next/navigation";
import { requireChatGPTUser } from "../chatgpt-auth";
import ControlRoom from "./ControlRoom";
import "./control-room.css";

export const dynamic = "force-dynamic";

export default async function AdminPage(){
  const user = await requireChatGPTUser("/admin");
  if(user.email.toLowerCase()!=="wallissonghost@gmail.com") redirect("/");
  let stats={editions:0,pages:0,requests:0,categories:0};
  try{const {env}=await import("cloudflare:workers");await env.DB.prepare("CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,title TEXT NOT NULL,subtitle TEXT NOT NULL DEFAULT '',category TEXT NOT NULL DEFAULT 'EDITORIAL',author TEXT NOT NULL DEFAULT 'Equipe DEU CAPA.',subject TEXT NOT NULL DEFAULT '',body TEXT NOT NULL DEFAULT '',cover_image TEXT NOT NULL DEFAULT '',instagram TEXT NOT NULL DEFAULT '',contact TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',featured INTEGER NOT NULL DEFAULT 0,scheduled_at TEXT NOT NULL DEFAULT '',created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL)").run();const rows:any=await env.DB.batch([env.DB.prepare("SELECT COUNT(*) AS n FROM editions"),env.DB.prepare("SELECT (SELECT COUNT(*) FROM magazine_pages)+(SELECT COUNT(*) FROM articles) AS n"),env.DB.prepare("SELECT COUNT(*) AS n FROM submissions WHERE status='new'"),env.DB.prepare("SELECT COUNT(*) AS n FROM editorial_categories WHERE active=1")]);stats={editions:Number(rows[0].results[0]?.n||0),pages:Number(rows[1].results[0]?.n||0),requests:Number(rows[2].results[0]?.n||0),categories:Number(rows[3].results[0]?.n||0)}}catch{}
  return <ControlRoom userName={user.displayName} stats={stats}/>;
}
