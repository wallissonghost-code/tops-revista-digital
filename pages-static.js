const pages=[
{label:'CAPA',title:'Talentos que inspiram',image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=88',text:'DEU CAPA. — edição de estreia.'},
{label:'EDITORIAL',title:'A força de uma imagem',image:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=88',text:'Histórias, marcas e pessoas transformadas em presença editorial.'},
{label:'MODA',title:'Identidade em movimento',image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=88',text:'Estilo, autoria e novas referências em evidência.'},
{label:'RETRATO',title:'Quem cria também inspira',image:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=88',text:'Retratos de quem movimenta ideias e comunidades.'},
{label:'EVENTOS',title:'Momentos inesquecíveis',image:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=88',text:'Acontecimentos que merecem virar memória.'},
{label:'AGENDA',title:'A cidade acontece aqui',image:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=88',text:'Lançamentos, encontros e experiências selecionadas.'},
{label:'NEGÓCIOS',title:'Marcas com propósito',image:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88',text:'Projetos locais com imagem, presença e intenção.'},
{label:'CONEXÕES',title:'Pessoas movem ideias',image:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=88',text:'Até a próxima edição.'}
];
let spread=0,startX=0;
const $=s=>document.querySelector(s);
function menu(){const n=$('#siteNav');if(n)n.classList.toggle('open')}
function openReader(){const r=$('#reader');if(!r)return;r.classList.add('open');document.body.style.overflow='hidden';renderReader()}
function closeReader(){const r=$('#reader');if(!r)return;r.classList.remove('open');document.body.style.overflow=''}
function changeReader(dir){const total=Math.ceil(pages.length/2);spread=(spread+dir+total)%total;renderReader()}
function renderPage(el,p,index){if(!el)return;el.className='readerPage '+(index%2===0?'image':'');if(index%2===0){el.style.backgroundImage=`url(${p.image})`;el.innerHTML=`<p class="eyebrow">${p.label}</p><h2>${p.title}</h2><span class="pageNo">PÁG. ${String(index+1).padStart(2,'0')}</span>`}else{el.style.backgroundImage='';el.innerHTML=`<p class="eyebrow">${p.label}</p><h2>${p.title}</h2><p>${p.text}</p><img src="${p.image}" alt="${p.title}" style="width:100%;height:46%;object-fit:cover;margin-top:15px"><span class="pageNo">PÁG. ${String(index+1).padStart(2,'0')}</span>`}}
function renderReader(){const l=spread*2,r=l+1;renderPage($('#readerLeft'),pages[l],l);renderPage($('#readerRight'),pages[r]||pages[0],r%pages.length);const c=$('#readerCount');if(c)c.textContent=`PÁGINAS ${l+1}–${Math.min(r+1,pages.length)} / ${pages.length}`}
function fullReader(){const b=$('#reader');if(b?.requestFullscreen)b.requestFullscreen()}
function prepareShare(){const type=$('#tipo')?.value||'Divulgação';const name=$('#nome')?.value||'';const contact=$('#contato')?.value||'';const msg=$('#mensagem')?.value||'';const text=`Olá! Quero aparecer na DEU CAPA.\nTipo: ${type}\nNome/Marca: ${name}\nContato: ${contact}\nMensagem: ${msg}`;navigator.clipboard?.writeText(text);const out=$('#formStatus');if(out)out.textContent='Texto da solicitação copiado. Agora você pode enviar pelo WhatsApp ou e-mail da revista.'}
document.addEventListener('keydown',e=>{if(!$('#reader')?.classList.contains('open'))return;if(e.key==='ArrowRight')changeReader(1);if(e.key==='ArrowLeft')changeReader(-1);if(e.key==='Escape')closeReader()});
document.addEventListener('DOMContentLoaded',()=>{const r=$('#reader');if(r){r.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});r.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>45)changeReader(d<0?1:-1)},{passive:true})}});