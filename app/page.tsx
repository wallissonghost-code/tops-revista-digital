"use client";

import { useEffect, useState } from "react";

const stories = [
  { tag: "NEGÓCIOS", title: "Marcas locais que transformam criatividade em movimento", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85", href:"/editorial" },
  { tag: "PERSONALIDADES", title: "Novos nomes, trajetórias e histórias para conhecer", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85", href:"/editorial" },
  { tag: "EVENTOS", title: "Os encontros que movimentam a cena criativa da região", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85", href:"/agenda" },
];

const gallery = [
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85",
];

const defaultCategories = [
  {id:"flash",label:"DEU FLASH",href:"/categoria/deu-flash"},
  {id:"historia",label:"DEU HISTÓRIA",href:"/categoria/deu-historia"},
  {id:"negocio",label:"DEU NEGÓCIO",href:"/categoria/deu-negocio"},
  {id:"estilo",label:"DEU ESTILO",href:"/categoria/deu-estilo"},
  {id:"gente",label:"DEU GENTE",href:"/categoria/deu-gente"},
  {id:"agenda",label:"DEU AGENDA",href:"/categoria/deu-agenda"},
];
const defaultSite={brand:"DEU CAPA.",slogan:"QUEM ACONTECE, APARECE.",heroEyebrow:"DEU CAPA. • EDIÇÃO DE ESTREIA",heroLine1:"Quem acontece,",heroLine2:"aparece.",heroDescription:"Uma experiência editorial criada para transformar talentos, marcas e acontecimentos em presença, desejo e conexão.",agendaTitle:"Onde tudo acontece",agendaText:"Divulgue lançamentos, feiras, festas, workshops e encontros com uma apresentação profissional."};

const defaultFlipPages = [
  { image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=88", label:"CAPA", title:"Talentos que inspiram" },
  { image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=88", label:"EDITORIAL", title:"A força de uma imagem" },
  { image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=88", label:"MODA", title:"Identidade em movimento" },
  { image:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=88", label:"RETRATO", title:"Quem cria também inspira" },
  { image:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=88", label:"EVENTOS", title:"Momentos inesquecíveis" },
  { image:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=88", label:"AGENDA", title:"A cidade acontece aqui" },
  { image:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88", label:"NEGÓCIOS", title:"Marcas com propósito" },
  { image:"https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=88", label:"CONEXÕES", title:"Pessoas movem ideias" },
];

export default function Home() {
  const [publishedStories,setPublishedStories] = useState(stories);
  const [flipPages,setFlipPages] = useState(defaultFlipPages);
  const [categories,setCategories] = useState(defaultCategories);
  const [tickerSpeed,setTickerSpeed] = useState(28);
  const [siteConfig,setSiteConfig] = useState(defaultSite);
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState(0);
  const [reader, setReader] = useState(false);
  const [turn, setTurn] = useState<"next"|"prev"|null>(null);
  const [touchStart, setTouchStart] = useState(0);
  useEffect(()=>{fetch("/api/editions?public=1").then(r=>r.json()).then((items:any[])=>{
    const edition=items?.[0]; if(!edition?.pages?.length) return;
    const pages=edition.pages.map((p:any)=>({image:p.imageUrl||edition.coverImage||defaultFlipPages[0].image,label:p.label||"EDITORIAL",title:p.title||"Sem título"}));
    if(pages.length%2) pages.push({image:"https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=88",label:"CONTRACAPA",title:"Até a próxima edição"});
    if(pages.length>=2)setFlipPages(pages);
  }).catch(()=>{})},[]);
  useEffect(()=>{fetch("/api/categories").then(r=>r.json()).then(data=>{if(data.items?.length)setCategories(data.items);if(data.speed)setTickerSpeed(data.speed)}).catch(()=>{})},[]);
  useEffect(()=>{fetch("/api/site-settings").then(r=>r.json()).then(data=>setSiteConfig({...defaultSite,...data})).catch(()=>{})},[]);
  useEffect(()=>{fetch("/api/articles").then(r=>r.json()).then((data:any[])=>{if(data?.length)setPublishedStories(data.slice(0,3).map(a=>({tag:a.category,title:a.title,image:a.coverImage||stories[0].image,href:`/artigo/${a.slug}`})))}).catch(()=>{})},[]);
  const flip = (direction:"next"|"prev") => {
    if(turn) return;
    setTurn(direction);
    window.setTimeout(()=>{
      setPage(current => direction === "next" ? (current + 1) % (flipPages.length/2) : (current + flipPages.length/2 - 1) % (flipPages.length/2));
      setTurn(null);
    }, 960);
  };
  const nextPage = () => flip("next");
  const prevPage = () => flip("prev");
  const onTouchEnd = (x:number) => { const distance=x-touchStart; if(Math.abs(distance)>45) flip(distance<0?"next":"prev"); };
  const leftIndex = page * 2;
  const rightIndex = page * 2 + 1;
  const nextLeftIndex = (leftIndex + 2) % flipPages.length;
  const nextRightIndex = (rightIndex + 2) % flipPages.length;
  const previousLeftIndex = (leftIndex + flipPages.length - 2) % flipPages.length;
  const previousRightIndex = (rightIndex + flipPages.length - 2) % flipPages.length;
  const visibleLeft = turn === "prev" ? previousLeftIndex : leftIndex;
  const visibleRight = turn === "next" ? nextRightIndex : rightIndex;
  const turningFrontIndex = turn === "prev" ? leftIndex : rightIndex;
  const turningBackIndex = turn === "prev" ? previousRightIndex : nextLeftIndex;

  return <main>
    <div className="topline"><span>PUBLICAÇÃO INDEPENDENTE • BRASIL</span><span>ARTE — MODA — CULTURA — NEGÓCIOS</span><span>VOL. 01 / 2026</span></div>
    <header className="header"><a className="brand brandOfficial" href="/"><i>DC.</i><span className="brandWords"><strong>{siteConfig.brand}</strong><small>{siteConfig.slogan}</small></span></a><button className="menuButton" onClick={()=>setMenu(!menu)} aria-label="Abrir menu">{menu?"×":"☰"}</button><nav className={menu?"nav open":"nav"}><a href="/">Início</a><a href="/edicoes">Edições</a><a href="/editorial">Editorial</a><a href="/galeria">Galeria</a><a href="/agenda">Agenda</a></nav><a className="outlineButton desktopCta" href="/divulgue"><span>✦</span> QUERO DIVULGAR</a></header>
    <section className="hero" id="inicio"><div className="heroNumber">01</div><div className="heroCopy"><p className="eyebrow">{siteConfig.heroEyebrow}</p><h1>{siteConfig.heroLine1}<br/><em>{siteConfig.heroLine2}</em></h1><p>{siteConfig.heroDescription}</p><div className="heroActions"><button onClick={()=>setReader(true)} className="goldButton">ABRIR A REVISTA <span>↗</span></button><a href="#anuncie" className="textLink">FAÇA PARTE DA PRÓXIMA EDIÇÃO</a></div><div className="heroStats"><span><b>120<sup>+</sup></b><small>CRIADORES<br/>PUBLICADOS</small></span><span><b>18K</b><small>LEITORES<br/>ALCANÇADOS</small></span><span><b>04</b><small>EDIÇÕES<br/>POR ANO</small></span></div></div>
      <div className="magazineStage"><button className="arrow left" onClick={prevPage}>‹</button><div className={`magazine ${turn?`turn-${turn}`:""}`} onTouchStart={e=>setTouchStart(e.touches[0].clientX)} onTouchEnd={e=>onTouchEnd(e.changedTouches[0].clientX)}><div className="cover" style={{backgroundImage:`url(${flipPages[visibleLeft].image})`}}><div className="coverShade"/><div className="coverMasthead"><div className="coverMonogram">DC.</div><div><div className="coverLogo">DEU CAPA.</div><small>QUEM ACONTECE, APARECE.</small></div></div><div className="coverEdition"><b>01</b><span>EDIÇÃO<br/>DE ESTREIA</span></div><div className="coverIssue">{flipPages[visibleLeft].label} • AGOSTO 2026</div><div className="coverHeadlines"><span>ENTREVISTAS</span><b>VOZES QUE<br/>MOVEM IDEIAS</b><span>FOTOGRAFIA</span><b>NOVOS OLHARES<br/>DA CIDADE</b></div><div className="coverTitle">{flipPages[visibleLeft].title.toUpperCase()}</div><div className="coverBottom"><span>FOTOGRAFIA • NEGÓCIOS • CULTURA</span><i className="barcode" aria-hidden="true"/></div></div><div className="inside"><p className="insideLabel">{flipPages[visibleRight].label}</p><h2>{flipPages[visibleRight].title}.</h2><p>Cada página apresenta uma história, uma imagem e uma experiência editorial diferente.</p><div className="insideImage" style={{backgroundImage:`url(${flipPages[visibleRight].image})`}}/><span>PÁG. {String(visibleRight+1).padStart(2,"0")}</span></div><div className="turningSheet"><div className="sheetFace sheetFront" style={{backgroundImage:`url(${flipPages[rightIndex].image})`}}><span>DEU CAPA. • {String(rightIndex+1).padStart(2,"0")}</span></div><div className="sheetFace sheetBack"><p>{flipPages[nextLeftIndex].label}</p><h3>{flipPages[nextLeftIndex].title}.</h3><div style={{backgroundImage:`url(${flipPages[nextLeftIndex].image})`}}/></div></div><div className="bookSpine"/></div><button className="arrow right" onClick={nextPage}>›</button><div className="dragHint">ARRASTE PARA FOLHEAR</div><div className="pageCounter">PÁGINAS {leftIndex+1}–{rightIndex+1} / 8</div></div>
    </section>
    <section className="ticker" aria-label="Categorias em destaque" style={{"--ticker-duration":`${tickerSpeed}s`} as any}><div className="tickerTrack">{[false,true].map((duplicate)=><div className="tickerGroup" aria-hidden={duplicate||undefined} key={String(duplicate)}>{categories.map(item=><span className="tickerItem" key={`${duplicate}-${item.id}`}><a href={item.href} tabIndex={duplicate?-1:undefined}>{item.label}</a><i>✦</i></span>)}</div>)}</div></section>
    <section className="section" id="destaques"><div className="sectionHead"><div><p className="eyebrow">EM EVIDÊNCIA</p><h2>Histórias que estão em destaque</h2></div><a href="/editorial">Ver todas as matérias →</a></div><div className="storyGrid">{publishedStories.map((story,i)=><article className={i===0?"story featured":"story"} key={story.title}><div className="storyImage" style={{backgroundImage:`url(${story.image})`}}><span>{story.tag}</span></div><p>DESTAQUE • 5 MIN DE LEITURA</p><h3>{story.title}</h3><a href={story.href}>Ler matéria ↗</a></article>)}</div></section>
    <section className="darkSection" id="galeria"><div className="sectionHead light"><div><p className="eyebrow">GALERIA DEU CAPA.</p><h2>Talentos em foco</h2></div><p className="sectionIntro">Um espaço visual para talentos, artistas, marcas e profissionais apresentarem imagens próprias e o melhor do seu trabalho.</p></div><div className="photoGrid">{gallery.map((image,i)=><div className={`photo p${i+1}`} key={image} style={{backgroundImage:`url(${image})`}}><span>{["MODA AUTORAL","BELEZA","RETRATO","PERSONALIDADE"][i]}</span></div>)}</div></section>
    <section className="section events" id="eventos"><div><p className="eyebrow">AGENDA & EXPERIÊNCIAS</p><h2>{siteConfig.agendaTitle}</h2><p>{siteConfig.agendaText}</p></div><div className="eventList"><article><time><b>22</b>AGO</time><div><span>LANÇAMENTO</span><h3>Encontro Criativo DEU CAPA.</h3><p>São José dos Campos • 19h</p></div><b>↗</b></article><article><time><b>06</b>SET</time><div><span>EXPOSIÇÃO</span><h3>Olhares da Cidade</h3><p>Galeria Central • 18h30</p></div><b>↗</b></article><article><time><b>18</b>OUT</time><div><span>NETWORKING</span><h3>Conexões que Inspiram</h3><p>Espaço Aurora • 20h</p></div><b>↗</b></article></div></section>
    <section className="advertise" id="anuncie"><div><p className="eyebrow">FAÇA PARTE DA PRÓXIMA EDIÇÃO</p><h2>Transforme visibilidade em oportunidade.</h2><p>Tenha sua marca, seu evento ou seu talento apresentado em uma revista com acabamento premium e distribuição digital.</p></div><div className="plans"><span>Perfil profissional</span><span>Editorial com fotos enviadas</span><span>Matéria patrocinada</span><span>Divulgação de evento</span><a className="goldButton" href="/divulgue">QUERO SAIR NA DEU CAPA.</a></div></section>
    <footer><a className="brand brandOfficial" href="#inicio"><i>DC.</i><span className="brandWords"><strong>{siteConfig.brand}</strong><small>{siteConfig.slogan}</small></span></a><p>Histórias, marcas e pessoas que merecem ser vistas.</p><div><a href="#destaques">Revista</a><a href="#galeria">Galeria</a><a href="#anuncie">Anuncie</a><a href="#inicio">Instagram ↗</a></div><small>© 2026 DEU CAPA. Revista Digital. Todos os direitos reservados.</small></footer>
    {reader&&<div className="reader" role="dialog" aria-modal="true"><button className="readerClose" onClick={()=>setReader(false)}>×</button><div className={`readerBook ${turn?`turn-${turn}`:""}`} onTouchStart={e=>setTouchStart(e.touches[0].clientX)} onTouchEnd={e=>onTouchEnd(e.changedTouches[0].clientX)}><div className="readerPage imagePage" style={{backgroundImage:`url(${flipPages[visibleLeft].image})`}}><b>DEU CAPA.</b><span>{flipPages[visibleLeft].label}</span></div><div className="readerPage"><p className="eyebrow">{flipPages[visibleRight].label}</p><h2>{flipPages[visibleRight].title}</h2><p>Uma página exclusiva para cada história. Arraste ou use as setas para folhear.</p><div className="readerPhoto" style={{backgroundImage:`url(${flipPages[visibleRight].image})`}}/></div><div className="readerTurning"><div className="readerTurnFront" style={{backgroundImage:`url(${flipPages[rightIndex].image})`}}/><div className="readerTurnBack"><p className="eyebrow">{flipPages[nextLeftIndex].label}</p><h2>{flipPages[nextLeftIndex].title}</h2></div></div></div><button className="readerArrow prev" onClick={prevPage}>‹</button><button className="readerArrow next" onClick={nextPage}>›</button><span className="readerCount">Páginas {leftIndex+1}–{rightIndex+1} de 8 • ARRASTE PARA FOLHEAR</span></div>}
  </main>;
}
