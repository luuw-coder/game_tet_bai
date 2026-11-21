// ui.js — vẽ bàn chơi, hoạt ảnh bài, âm thanh, toast.
const ctr=e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}};
// Bài bay theo đường cong, nảy nhẹ rồi hạ xuống đúng chỗ (vị trí cuối lấy từ CSS)
function fly(e,f,ms=340,d=0){if(!pf.anim||!e)return;const t=ctr(e),r=(Math.random()-.5)*60;
  e.animate([{transform:`translate(${f.x-t.x}px,${f.y-t.y}px) scale(.45) rotate(${r}deg)`,opacity:.15,filter:'brightness(1.5)'},
   {transform:`translate(${(f.x-t.x)*.16}px,${(f.y-t.y)*.16-26}px) scale(1.12) rotate(${-r/5}deg)`,opacity:1,filter:'brightness(1.12)',offset:.7}],
   {duration:ms*1.2,delay:d,easing:'cubic-bezier(.22,.9,.3,1)',fill:'backwards'})}
function flyPile(i){const f=ctr($(i?'s'+i:'hand')),cs=[...$('pile').querySelectorAll('.cd')];cs.forEach((e,k)=>fly(e,f,340,k*45));
  if(pf.anim){const r=document.createElement('div');r.className='rp';r.style.animationDelay=(.3+cs.length*.04)+'s';$('pile').append(r)}}
function fin(){S.dl=0;$('deck').classList.add('gone');rend();S.over?end():tick()}
const cur=()=>G.mode=='phom'?PH.id:S.id;
function startDeal(N=S.n*NP,done=fin,id0=S.id){
  rend();if(!pf.anim){done();return}
  const dk=ctr($('deck')),hs=[...$('hand').children];
  for(let i=0;i<N;i++){const p=i%NP,d=i*42;
    if(p==0)fly(hs[i/4|0],dk,380,d);
    else{const e=document.createElement('div');e.className='cd back fl';e.style.cssText=`left:${dk.x}px;top:${dk.y}px`;document.body.append(e);
      const t=ctr($('s'+p));e.animate([{transform:'translate(-50%,-50%) scale(.8)'},{transform:`translate(calc(-50% + ${t.x-dk.x}px),calc(-50% + ${t.y-dk.y}px)) rotate(${(Math.random()-.5)*40}deg) scale(1)`}],{duration:400,delay:d,easing:'cubic-bezier(.3,.7,.3,1)',fill:'both'}).onfinish=()=>e.remove()}
    setTimeout(()=>snd(700+Math.random()*100,.03,'square',.4),d)}
  setTimeout(()=>{if(cur()==id0)done()},N*42+500);
}
const cardH=(c,st='')=>`<div class="cd${red(c)?' r':''}${sel.has(c)?' sel':''}" data-c="${c}"${st}><span>${R[c>>2]}<br>${SU[c&3]}</span><b>${SU[c&3]}</b><u>${R[c>>2]}</u></div>`;
function rend(){
  if(G.mode=='phom')return rendP();
  const L=S.last,me=sortHand(S.h[0],S.sm),on=S.t==0&&!S.over&&!S.dl,n=me.length,P=NP==5?POS5:POS;
  for(let i=1;i<NP;i++){const e=$('s'+i),t=S.t==i&&!S.over,k=S.h[i].length;e.className=`seat ${P[i]}${t?' on':''}${S.ps[i]?' ps':''}`;
    e.innerHTML=`<div class="av">${AV[i]}</div><b>${NM[i]}</b><div class="fan">${'<i class="cd back"></i>'.repeat(Math.min(k,5))}<em>${k}</em></div><small>${S.ps[i]?'Bỏ lượt':t&&!S.dl?'Đang nghĩ…':''}</small>`}
  $('s4').hidden=NP<5;$('s0').className='me'+(on?' on':'');
  $('mi').textContent=`${AV[0]} ${NM[0]} · ${S.h[0].length} lá${S.ps[0]?' · Bỏ lượt':on?' · Đến lượt bạn':''}`;
  $('hand').innerHTML=me.map((c,i)=>{const o=i-(n-1)/2;return cardH(c,` style="--r:${o*3}deg;--y:${o*o*.9}px"`)}).join('');
  $('pile').innerHTML=L?L.c.map(c=>cardH(c,` style="transform:rotate(${(c*7)%9-4}deg)"`)).join(''):'';
  $('pl').textContent=L?`${NM[L.p]}: ${TN[cls(L.c).t]}`:S.over||S.dl?'':'Mở lượt mới';
  $('bPlay').disabled=!on||!sel.size;$('bPass').disabled=!on||!L;
  $('bDraw').hidden=$('bEat').hidden=true;$('bPass').hidden=false;$('bPlay').textContent='Đánh bài';$('myrow').innerHTML='';$('deck').innerHTML='<em>♠</em>';
}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1800)}
function err(m){toast(m);snd(130,.22,'sawtooth')}
let AC;function snd(f,d=.08,t='sine',v=1,at=0){if(!pf.snd||!pf.vol)return;try{AC??=new AudioContext();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime+at;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(.2*pf.vol*v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(AC.destination);o.start(n);o.stop(n+d)}catch(e){}}
function show(v){['sel','menu','lob','game'].forEach(x=>$(x).hidden=x!=v);cv=v;document.body.classList.toggle('ing',v=='game')}
const act=()=>{const r=G.mode=='phom'?(sel.size==1?pDisc(0,[...sel][0]):'Chọn đúng 1 lá để đánh.'):play(0,[...sel]);if(r)err(r)};

// Xếp bài: 0 theo số, 1 theo chất, 2 theo bộ (Tiến lên: đôi/sám/tứ quý trước; Phỏm: các phỏm trước)
function sortHand(h,m){const a=[...h],ph=G.mode=='phom',v=ph?nat:c=>c>>2;
  if(m==1)return a.sort((x,y)=>(x&3)-(y&3)||x-y);
  if(m==2){if(ph){const b=bestMelds(a),u=new Set(b.m.flat());return[...b.m.flat(),...a.filter(c=>!u.has(c)).sort((x,y)=>nat(x)-nat(y))]}
    const n={};a.forEach(c=>n[c>>2]=(n[c>>2]||0)+1);return a.sort((x,y)=>n[y>>2]-n[x>>2]||x-y)}
  return a.sort((x,y)=>v(x)-v(y)||x-y)}
// Chữ nổi và rung bàn khi đánh bộ đặc biệt
function banner(t,hot){const b=document.createElement('div');b.className='bn'+(hot?' hot':'');b.textContent=t;$('tb').append(b);setTimeout(()=>b.remove(),1500)}
function fx(x,pv){const chat=pv&&(pv.t!=x.t||pv.n!=x.n),t=chat?'CHẶT!':x.t=='q'?'TỨ QUÝ!':x.t=='dt'?'ĐÔI THÔNG!':x.t=='st'&&x.n>=5?'SẢNH '+x.n+' LÁ':'';
  if(!t||!pf.anim)return;banner(t,chat);snd(chat?110:660,.3,'sawtooth',.8);if(chat)$('tb').animate([{transform:'translate(0)'},{transform:'translate(-7px,3px)'},{transform:'translate(6px,-3px)'},{transform:'translate(0)'}],{duration:340})}
// Bàn Phỏm
function rendP(){const P=PH,on=P.t==0&&!P.over&&!P.dl,me=sortHand(P.h[0],P.sm),n=me.length,u=new Set(bestMelds(P.h[0]).m.flat()),L=P.last,
  mini=c=>`<span class="mc${red(c)?' r':''}">${R[c>>2]}${SU[c&3]}</span>`,eat=!!(L&&L.p==3&&P.ph=='draw'&&canEat(P.h[0],L.c));
  for(let i=1;i<4;i++){const e=$('s'+i),t=P.t==i&&!P.over;e.className=`seat ${POS[i]}${t?' on':''}`;
    e.innerHTML=`<div class="av">${AV[i]}</div><b>${NM[i]}</b><div class="fan">${'<i class="cd back"></i>'.repeat(Math.min(P.h[i].length,5))}<em>${P.h[i].length}</em></div><div class="mr">${P.disc[i].map(mini).join('')}</div><div class="mr ate">${P.ate[i].map(mini).join('')}</div><small>${t&&!P.dl?'Đang nghĩ…':''}</small>`}
  $('s4').hidden=1;$('s0').className='me'+(on?' on':'');
  $('mi').textContent=`${AV[0]} ${NM[0]} · ${n} lá${on?(P.ph=='draw'?' · Bốc nọc hoặc ăn bài':' · Chọn 1 lá để đánh'):''}`;
  $('myrow').innerHTML=`<div class="mr">${P.disc[0].map(mini).join('')}</div><div class="mr ate">${P.ate[0].map(mini).join('')}</div>`;
  $('hand').innerHTML=me.map((c,i)=>{const o=i-(n-1)/2;return cardH(c,` style="--r:${o*3}deg;--y:${o*o*.9}px"${u.has(c)?' data-m="1"':''}`)}).join('');
  $('pile').innerHTML=L?cardH(L.c):'';$('pl').textContent=L?`${NM[L.p]} vừa đánh${eat&&on?' · bạn ăn được':''}`:'';
  $('deck').innerHTML=`<em>${P.noc.length}</em>`;
  $('bDraw').hidden=$('bEat').hidden=false;$('bPass').hidden=true;$('bPlay').textContent='Đánh lá';
  $('bDraw').disabled=!on||P.ph!='draw';$('bEat').disabled=!on||!eat;$('bPlay').disabled=!on||P.ph!='disc'||sel.size!=1}
