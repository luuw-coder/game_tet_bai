// phom.js — luật và luồng ván Phỏm (Tá lả): 4 người, dealer 10 lá, người khác 9 lá, nọc 15 lá, mỗi người đánh 4 lá.
const nat=c=>((c>>2)+2)%13+1,pv=c=>nat(c); // A=1, 2..10, J=11, Q=12, K=13
function cand(h){const o=[],g={},s=[[],[],[],[]];h.forEach(c=>{(g[nat(c)]??=[]).push(c);s[c&3].push(c)});
  for(const k in g){const a=g[k];if(a.length==3)o.push([...a]);if(a.length==4){o.push([...a]);a.forEach((_,i)=>o.push(a.filter((_,j)=>j!=i)))}}
  s.forEach(v=>{v.sort((p,q)=>nat(p)-nat(q));for(let i=0;i<v.length;i++)for(let j=i+2;j<v.length;j++){if(nat(v[j])-nat(v[i])!=j-i)break;o.push(v.slice(i,j+1))}});
  return o}
function bestMelds(h){const cs=cand(h);let best={m:[],pts:-1};
  const go=(i,used,m,pts)=>{if(pts>best.pts)best={m:m.map(x=>[...x]),pts};for(let j=i;j<cs.length;j++){const c=cs[j];if(c.every(x=>!used.has(x))){c.forEach(x=>used.add(x));m.push(c);go(j+1,used,m,pts+c.reduce((s,x)=>s+pv(x),0));m.pop();c.forEach(x=>used.delete(x))}}};
  go(0,new Set(),[],0);return best}
const canEat=(h,c)=>cand(h.concat(c)).some(m=>m.includes(c));
const allMelds=h=>bestMelds(h).m.flat().length==h.length;
function canAdd(m,c){ // gửi lá c vào phỏm m
  if(m.every(x=>nat(x)==nat(m[0])))return m.length<4&&nat(c)==nat(m[0])&&!m.some(x=>(x&3)==(c&3));
  const v=m.map(nat).sort((a,b)=>a-b);return (c&3)==(m[0]&3)&&(nat(c)==v[0]-1||nat(c)==v.at(-1)+1)}

let PH=null;
function pStart(){
  const d=[...Array(52).keys()];for(let i=51;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]]}
  const dl=fresh?0:lastW;let k=0;const h=[0,1,2,3].map(p=>{const n=p==dl?10:9,a=d.slice(k,k+n);k+=n;return a});
  PH={h,noc:d.slice(k),disc:[[],[],[],[]],ate:[[],[],[],[]],t:dl,ph:'disc',tn:[0,0,0,0],last:null,over:0,dl:1,sm:0,id:Date.now()};
  sel.clear();$('ov').hidden=1;$('ov').querySelectorAll('s').forEach(e=>e.remove());$('deck').classList.remove('gone');show('game');
  startDeal(37,()=>{PH.dl=0;if(allMelds(PH.h[PH.t]))pFinish(PH.t,'Ù khan! Đủ phỏm ngay khi chia bài.');else{rend();pTick()}},PH.id);
}
function pTick(){if(PH.over||PH.dl||PH.t==0)return;const id=PH.id;setTimeout(()=>{if(PH.id==id&&!PH.over&&PH.t!=0)pBot()},pf.anim?1000:200)}
const pChk=p=>PH.h[p].length==10&&allMelds(PH.h[p]);
function pDraw(p){
  if(PH.over||PH.dl||PH.t!=p||PH.ph!='draw')return'Chưa đến lúc bốc bài.';if(!PH.noc.length)return'Nọc đã hết.';
  const c=PH.noc.pop();PH.h[p].push(c);PH.last=null;PH.ph='disc';snd(420,.06);rend();
  if(p==0&&pf.anim)fly($('hand').querySelector('[data-c="'+c+'"]'),ctr($('deck')),380);
  if(pChk(p)){pFinish(p,'Ù! Tất cả bài đều nằm trong phỏm.');return''}
  pTick();return'';
}
function pEat(p){
  const L=PH.last;if(PH.over||PH.dl||PH.t!=p||PH.ph!='draw')return'Chưa đến lúc ăn bài.';
  if(!L||L.p!=(p+3)%4)return'Không có lá nào để ăn.';if(!canEat(PH.h[p],L.c))return'Lá này không tạo được phỏm nên không ăn được.';
  PH.disc[L.p]=PH.disc[L.p].filter(x=>x!=L.c);PH.h[p].push(L.c);PH.ate[p].push(L.c);PH.last=null;PH.ph='disc';
  snd(520,.1,'triangle');toast(NM[p]+' ăn '+R[L.c>>2]+SU[L.c&3]);rend();
  if(p==0&&pf.anim)fly($('hand').querySelector('[data-c="'+L.c+'"]'),ctr($('pile')),380);
  if(pChk(p)){pFinish(p,'Ù! Tất cả bài đều nằm trong phỏm.');return''}
  pTick();return'';
}
function pDisc(p,c){
  if(PH.over||PH.dl||PH.t!=p||PH.ph!='disc')return'Chưa đến lúc đánh bài.';
  if(!PH.h[p].includes(c))return'Bài không thuộc tay bạn.';if(PH.ate[p].includes(c))return'Không được đánh lại lá đã ăn.';
  PH.h[p]=PH.h[p].filter(x=>x!=c);PH.disc[p].push(c);PH.last={p,c};PH.tn[p]++;if(p==0)sel.clear();snd(260,.09,'triangle');
  if(PH.tn.every(x=>x>=4)){PH.dl=1;rend();flyPile(p);const fn=()=>{if(!PH.over)pFinish(-1,'Hết 4 lượt: tự hạ phỏm và gửi bài.')};pf.anim?setTimeout(fn,700):fn();return''}
  PH.t=(p+1)%4;PH.ph='draw';rend();flyPile(p);pTick();return'';
}
function pBot(){
  const p=PH.t,h=PH.h[p];
  if(PH.ph=='draw'){const L=PH.last;if(L&&L.p==(p+3)%4&&canEat(h,L.c)&&(LV>0||Math.random()<.4)&&!pEat(p))return;if(pDraw(p))pFinish(-1,'Nọc đã hết.');return}
  const u=new Set(bestMelds(h).m.flat()),ok=h.filter(c=>!PH.ate[p].includes(c));let pool=ok.filter(c=>!u.has(c));if(!pool.length)pool=ok;
  const near=c=>h.some(x=>x!=c&&(nat(x)==nat(c)||((x&3)==(c&3)&&Math.abs(nat(x)-nat(c))<=2)));
  if(LV==2){const q=pool.filter(c=>!near(c));if(q.length)pool=q}
  pool=pool.sort((a,b)=>pv(b)-pv(a));pDisc(p,LV==0?pool[Math.random()*pool.length|0]:pool[0]);
}
function pFinish(win,why){
  PH.over=1;PH.dl=0;const L=c=>R[c>>2]+SU[c&3];
  const Z=PH.h.map((h,i)=>{const b=bestMelds(h),u=new Set(b.m.flat());return{i,m:b.m.map(x=>[...x]),rest:h.filter(c=>!u.has(c)),g:0}});
  if(win<0){let ch=1;while(ch){ch=0;Z.forEach(r=>{if(!r.m.length)return;[...r.rest].sort((a,b)=>pv(b)-pv(a)).forEach(c=>{if(!r.rest.includes(c))return;for(const q of Z)for(const m of q.m)if(canAdd(m,c)){m.push(c);r.rest=r.rest.filter(x=>x!=c);r.g++;ch=1;return}})})}}
  Z.forEach(r=>r.pts=r.rest.reduce((s,c)=>s+pv(c),0));
  const o=[...Z].sort((a,b)=>(a.i==win?-1:b.i==win?1:0)||((!a.m.length)-(!b.m.length))||a.pts-b.pts),M=['🥇','🥈','🥉','4️⃣'];
  lastW=o[0].i;fresh=0;rend();
  $('ov').hidden=0;$('ovc').innerHTML=`<h2>${o[0].i==0?'🎉 Bạn nhất!':'🏆 '+NM[o[0].i]+' nhất'}</h2><p>${why}</p><ol style="list-style:none;padding:0">${o.map((r,k)=>`<li>${M[k]} <b>${NM[r.i]}</b> — ${r.pts} điểm${r.m.length?'':' · móm'}${r.i==win?' · ù':''}<br><small>${r.m.map(x=>'['+x.map(L).join(' ')+']').join(' ')}${r.rest.length?' · rác '+r.rest.map(L).join(' '):''}${r.g?' · gửi '+r.g+' lá':''}</small></li>`).join('')}</ol><div class="row"><button class="btn" id="oN">Ván tiếp</button><button class="btn o" id="oL">Về phòng</button><button class="btn o" id="oS">Chọn game khác</button></div>`;
  $('oN').onclick=startGame;$('oL').onclick=()=>{fresh=1;PH.id=-1;toLob()};$('oS').onclick=()=>{fresh=1;PH.id=-1;openMenu(gm)};
  [523,659,784,1047].forEach((f,k)=>snd(f,.25,'triangle',1,k*.12));
  if(pf.anim)for(let i=0;i<40;i++){const e=document.createElement('s');e.style.cssText=`left:${Math.random()*100}%;background:hsl(${Math.random()*360} 85% 60%);animation-delay:${Math.random()*.8}s`;$('ov').append(e)}
}
