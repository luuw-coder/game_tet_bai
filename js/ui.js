// ui.js — vẽ bàn chơi, hoạt ảnh bài, âm thanh, toast.
const ctr=e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}};
// Bài bay theo đường cong, nảy nhẹ rồi hạ xuống đúng chỗ (vị trí cuối lấy từ CSS)
function fly(e,f,ms=340,d=0){if(!pf.anim||!e)return;const t=ctr(e),r=(Math.random()-.5)*60;
  e.animate([{transform:`translate(${f.x-t.x}px,${f.y-t.y}px) scale(.45) rotate(${r}deg)`,opacity:.15,filter:'brightness(1.5)'},
   {transform:`translate(${(f.x-t.x)*.16}px,${(f.y-t.y)*.16-26}px) scale(1.12) rotate(${-r/5}deg)`,opacity:1,filter:'brightness(1.12)',offset:.7}],
   {duration:ms*1.2,delay:d,easing:'cubic-bezier(.22,.9,.3,1)',fill:'backwards'})}
function flyPile(i){const f=ctr($(i?'s'+i:'hand')),cs=[...$('pile').querySelectorAll('.cd')];cs.forEach((e,k)=>fly(e,f,340,k*45));
  if(pf.anim){const r=document.createElement('div');r.className='rp';r.style.animationDelay=(.3+cs.length*.04)+'s';$('pile').append(r)}}
function fin(){S.dl=0;rend();S.over?end():tick()}
function startDeal(){
  rend();if(!pf.anim){fin();return}
  const dk=ctr($('deck')),hs=[...$('hand').children],N=S.n*4;
  for(let i=0;i<N;i++){const p=i%4,d=i*42;
    if(p==0)fly(hs[i/4|0],dk,380,d);
    else{const e=document.createElement('div');e.className='cd back fl';e.style.cssText=`left:${dk.x}px;top:${dk.y}px`;document.body.append(e);
      const t=ctr($('s'+p));e.animate([{transform:'translate(-50%,-50%) scale(.8)'},{transform:`translate(calc(-50% + ${t.x-dk.x}px),calc(-50% + ${t.y-dk.y}px)) rotate(${(Math.random()-.5)*40}deg) scale(1)`}],{duration:400,delay:d,easing:'cubic-bezier(.3,.7,.3,1)',fill:'both'}).onfinish=()=>e.remove()}
    setTimeout(()=>snd(700+Math.random()*100,.03,'square',.4),d)}
  const id=S.id;setTimeout(()=>{if(S.id==id)fin()},N*42+500);
}
const cardH=(c,st='')=>`<div class="cd${red(c)?' r':''}${sel.has(c)?' sel':''}" data-c="${c}"${st}><span>${R[c>>2]}<br>${SU[c&3]}</span><b>${SU[c&3]}</b><u>${R[c>>2]}</u></div>`;
function rend(){
  const L=S.last,me=[...S.h[0]].sort(S.sm?(a,b)=>(a&3)-(b&3)||a-b:(a,b)=>a-b),on=S.t==0&&!S.over&&!S.dl,n=me.length;
  [1,2,3].forEach(i=>{const e=$('s'+i),t=S.t==i&&!S.over,k=S.h[i].length;e.className=`seat ${POS[i]}${t?' on':''}${S.ps[i]?' ps':''}`;
    e.innerHTML=`<div class="av">${AV[i]}</div><b>${NM[i]}</b><div class="fan">${'<i class="cd back"></i>'.repeat(Math.min(k,5))}<em>${k}</em></div><small>${S.ps[i]?'Bỏ lượt':t&&!S.dl?'Đang nghĩ…':''}</small>`});
  $('s0').className='me'+(on?' on':'');
  $('mi').textContent=`${AV[0]} ${NM[0]} · ${S.h[0].length} lá${S.ps[0]?' · Bỏ lượt':on?' · Đến lượt bạn':''}`;
  $('hand').innerHTML=me.map((c,i)=>{const o=i-(n-1)/2;return cardH(c,` style="--r:${o*3}deg;--y:${o*o*.9}px"`)}).join('');
  $('pile').innerHTML=L?L.c.map(c=>cardH(c,` style="transform:rotate(${(c*7)%9-4}deg)"`)).join(''):'';
  $('pl').textContent=L?`${NM[L.p]}: ${TN[cls(L.c).t]}`:S.over||S.dl?'':'Mở lượt mới';
  $('bPlay').disabled=!on||!sel.size;$('bPass').disabled=!on||!L;
}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1800)}
function err(m){toast(m);snd(130,.22,'sawtooth')}
let AC;function snd(f,d=.08,t='sine',v=1,at=0){if(!pf.snd||!pf.vol)return;try{AC??=new AudioContext();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime+at;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(.2*pf.vol*v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(AC.destination);o.start(n);o.stop(n+d)}catch(e){}}
function show(v){['sel','menu','lob','game'].forEach(x=>$(x).hidden=x!=v);cv=v;document.body.classList.toggle('ing',v=='game')}
const act=()=>{const r=play(0,[...sel]);if(r)err(r)};
