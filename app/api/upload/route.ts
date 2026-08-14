import { getChatGPTUser } from "../../chatgpt-auth";

export async function POST(request: Request) {
  const env = (await import("cloudflare:workers")).env;
  const user = await getChatGPTUser();
  if (user?.email.toLowerCase() !== "wallissonghost@gmail.com") return Response.json({error:"Não autorizado"},{status:401});
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({error:"Escolha uma imagem"},{status:400});
  if (!file.type.startsWith("image/")) return Response.json({error:"Arquivo precisa ser uma imagem"},{status:400});
  if (file.size > 10 * 1024 * 1024) return Response.json({error:"Imagem maior que 10 MB"},{status:400});
  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi,"").toLowerCase() || "jpg";
  const key = `magazine/${crypto.randomUUID()}.${extension}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {httpMetadata:{contentType:file.type}});
  return Response.json({url:`/api/media/${encodeURIComponent(key)}`});
}
