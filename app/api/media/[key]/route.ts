export async function GET(_request:Request,{params}:{params:Promise<{key:string}>}) {
  const env = (await import("cloudflare:workers")).env;
  const {key} = await params;
  const object = await env.BUCKET.get(decodeURIComponent(key));
  if(!object) return new Response("Imagem não encontrada",{status:404});
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag",object.httpEtag);
  headers.set("cache-control","public, max-age=31536000, immutable");
  return new Response(object.body,{headers});
}
