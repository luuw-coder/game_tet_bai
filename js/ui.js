// ui.js — Vẽ bàn chơi, hoạt ảnh bài, âm thanh, toast.
/* ===== UI ===== */
const ctr=e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}};
function flyPile(i){const f=ctr($(i?'s'+i:'hand'));[...$('pile').children].forEach((e,k)=>fly(e,f,340,k*45))}
function fin(){S.dl=0;rend();S.over?end():tick()}
function startDeal(){
  rend();if(!pf.anim){fin();return}
  const dk=ctr($('deck')),hs=[...$('hand').children];
  for(let i=0;i<52;i++){const p=i%4,d=i*42;
    if(p==0)fly(hs[i/4|0],dk,380,d);
    else{const e=document.createElement('div');e.className='cd back fl';e.style.cssText=`left:${dk.x}px;top:${dk.y}px`;e.innerHTML='';document.body.append(e);
      const t=ctr($('s'+p));e.animate([{transform:'translate(-50%,-50%)'},{transform:`translate(calc(-50% + ${t.x-dk.x}px),calc(-50% + ${t.y-dk.y}px)) rotate(${(Math.random()-.5)*30}deg)`}],{duration:380,delay:d,easing:'ease-out',fill:'both'}).onfinish=()=>e.remove()}
    setTimeout(()=>snd(700+Math.random()*100,.03,'square',.4),d)}
  const id=S.id;setTimeout(()=>{if(S.id==id)fin()},52*42+450);
}
const cardH=c=>`<div class="cd${red(c)?' r':''}${sel.has(c)?' sel':''}" data-c="${c}"><span>${R[c>>2]}<br>${SU[c&3]}</span><b>${SU[c&3]}</b></div>`;
function rend(){
  const L=S.last,me=[...S.h[0]].sort(S.sm?(a,b)=>(a&3)-(b&3)||a-b:(a,b)=>a-b),on=S.t==0&&!S.over&&!S.dl;
  [1,2,3].forEach(i=>{const e=$('s'+i),t=S.t==i&&!S.over;e.className=`seat ${POS[i]}${t?' on':''}`;
    e.innerHTML=`<div class="av">${AV[i]}</div><b>${NM[i]}</b><div class="cd back"><em>${S.h[i].length}</em></div><small>${S.ps[i]?'Bỏ lượt':t&&!S.dl?'Đang nghĩ…':''}</small>`});
  $('s0').className='me'+(on?' on':'');
  $('mi').textContent=`${AV[0]} ${NM[0]} · ${S.h[0].length} lá${S.ps[0]?' · Bỏ lượt':on?' · Đến lượt bạn':''}`;
  $('hand').innerHTML=me.map(cardH).join('');
  $('pile').innerHTML=L?L.c.map(cardH).join(''):'';
  $('pl').textContent=L?`${NM[L.p]}: ${TN[cls(L.c).t]}`:S.over||S.dl?'':'Mở lượt mới';
  $('bPlay').disabled=!on||!sel.size;$('bPass').disabled=!on||!L;
}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1800)}
function err(m){toast(m);snd(130,.22,'sawtooth')}
let AC;function snd(f,d=.08,t='sine',v=1,at=0){if(!pf.snd||!pf.vol)return;try{AC??=new AudioContext();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime+at;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(.2*pf.vol*v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(AC.destination);o.start(n);o.stop(n+d)}catch(e){}}
function show(v){['sel','menu','lob','game'].forEach(x=>$(x).hidden=x!=v);cv=v;document.body.classList.toggle('ing',v=='game')}
