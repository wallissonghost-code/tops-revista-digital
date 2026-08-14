import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

const config = window.DEUCAPA_FIREBASE_CONFIG || {};
const configured = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
const notice = document.getElementById('firebaseNotice');
const authShell = document.getElementById('authShell');
const adminApp = document.getElementById('adminApp');
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
const tabs = document.getElementById('collectionTabs');
const crudForm = document.getElementById('crudForm');
const dataList = document.getElementById('dataList');
const crudStatus = document.getElementById('crudStatus');
const clearBtn = document.getElementById('clearBtn');
const formTitle = document.getElementById('formTitle');
const docId = document.getElementById('docId');
const fieldTitle = document.getElementById('fieldTitle');
const fieldSlug = document.getElementById('fieldSlug');
const fieldStatus = document.getElementById('fieldStatus');
const fieldImage = document.getElementById('fieldImage');
const fieldText = document.getElementById('fieldText');
let activeCollection = 'articles';
let db, auth;

function labelFor(col){return ({articles:'matéria',events:'evento',categories:'categoria',editions:'edição',site_settings:'configuração'})[col]||'registro'}
function slugify(v=''){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}
function resetForm(){docId.value='';fieldTitle.value='';fieldSlug.value='';fieldStatus.value='draft';fieldImage.value='';fieldText.value='';formTitle.textContent=`Novo ${labelFor(activeCollection)}`;crudStatus.textContent=''}
function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}

if(!configured){
  notice.innerHTML='Firebase ainda não configurado. Abra <b>firebase-config.js</b> e cole o firebaseConfig do app web da DEU CAPA.';
  loginForm.querySelector('button').disabled=true;
}else{
  notice.style.display='none';
  const app=initializeApp(config);
  auth=getAuth(app); db=getFirestore(app);
  onAuthStateChanged(auth,user=>{
    if(user){authShell.style.display='none';adminApp.classList.add('ready');userEmail.textContent=user.email||'Administrador';loadCollection();}
    else{authShell.style.display='grid';adminApp.classList.remove('ready');}
  });
}

loginForm?.addEventListener('submit',async e=>{e.preventDefault();loginStatus.textContent='Entrando...';try{await signInWithEmailAndPassword(auth,document.getElementById('loginEmail').value,document.getElementById('loginPassword').value);loginStatus.textContent='';}catch(err){loginStatus.textContent='Não foi possível entrar. Confira e-mail, senha e se Email/Senha está ativo no Firebase.';console.error(err)}});
logoutBtn?.addEventListener('click',()=>signOut(auth));
clearBtn?.addEventListener('click',resetForm);
fieldTitle?.addEventListener('blur',()=>{if(!fieldSlug.value)fieldSlug.value=slugify(fieldTitle.value)});
tabs?.addEventListener('click',e=>{const b=e.target.closest('[data-col]');if(!b)return;tabs.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeCollection=b.dataset.col;resetForm();loadCollection()});

async function loadCollection(){
  if(!db)return;dataList.innerHTML='<p class="statusLine">Carregando...</p>';
  try{
    let snap;
    try{snap=await getDocs(query(collection(db,activeCollection),orderBy('updatedAt','desc')))}catch{snap=await getDocs(collection(db,activeCollection))}
    const rows=snap.docs.map(d=>({id:d.id,...d.data()}));
    if(!rows.length){dataList.innerHTML='<p class="statusLine">Nenhum registro ainda.</p>';return}
    dataList.innerHTML=rows.map(r=>`<article class="dataItem" data-id="${r.id}"><b>${escapeHtml(r.title||r.name||r.slug||r.id)}</b><small>${escapeHtml(r.status||'sem status')} • ${escapeHtml(r.slug||r.id)}</small><p>${escapeHtml((r.text||r.description||'').slice(0,150))}</p><div class="rowActions"><button data-edit>EDITAR</button><button data-delete>EXCLUIR</button></div></article>`).join('');
    dataList.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.closest('[data-id]').dataset.id;const r=rows.find(x=>x.id===id);docId.value=id;fieldTitle.value=r.title||r.name||'';fieldSlug.value=r.slug||'';fieldStatus.value=r.status||'draft';fieldImage.value=r.image||r.coverImage||'';fieldText.value=r.text||r.description||'';formTitle.textContent=`Editar ${labelFor(activeCollection)}`;window.scrollTo({top:0,behavior:'smooth'})}));
    dataList.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',async()=>{const id=btn.closest('[data-id]').dataset.id;if(!confirm('Excluir este registro?'))return;try{await deleteDoc(doc(db,activeCollection,id));await loadCollection()}catch(err){alert('Não foi possível excluir. Verifique as regras do Firestore.');console.error(err)}}));
  }catch(err){dataList.innerHTML='<p class="statusLine">Erro ao carregar. Verifique o Firestore e as Security Rules.</p>';console.error(err)}
}

crudForm?.addEventListener('submit',async e=>{
  e.preventDefault(); if(!db)return; crudStatus.textContent='Salvando...';
  const payload={title:fieldTitle.value.trim(),slug:(fieldSlug.value||slugify(fieldTitle.value)).trim(),status:fieldStatus.value,image:fieldImage.value.trim(),text:fieldText.value.trim(),updatedAt:serverTimestamp()};
  try{
    if(docId.value){await setDoc(doc(db,activeCollection,docId.value),payload,{merge:true})}
    else{await addDoc(collection(db,activeCollection),{...payload,createdAt:serverTimestamp()})}
    crudStatus.textContent='Salvo no Firestore.';resetForm();await loadCollection();
  }catch(err){crudStatus.textContent='Falha ao salvar. Confira as regras do Firestore.';console.error(err)}
});
