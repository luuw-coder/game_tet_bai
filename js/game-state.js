// game-state.js — Trạng thái ván: chia bài, đánh, bỏ lượt, bot, kết thúc. Mọi nước đi đều được xác minh ở đây.
/* ===== GAME STATE: mọi hành động đều được xác minh ở đây ===== */
function play(i,c){
  if(S.over||S.dl)return'Chưa thể đánh lúc này.';
  if(S.t!=i)return'Chưa đến lượt bạn.';
  if(!c.length||new Set(c).size!=c.length||!c.every(x=>S.h[i].includes(x)))return'Bài không thuộc tay bạn.';
  const x=cls(c);if(!x)return'Bộ bài không hợp lệ.';
  if(S.f3&&!c.includes(0))return'Nước đầu tiên phải có 3♠.';
  if(S.last&&!beats(cls(S.last.c),x,G))return'Bộ bài này không chặn được bộ trước.';
  const pv0=S.last&&cls(S.last.c);fx(x,pv0);S.f3=0;S.h[i]=S.h[i].filter(y=>!c.includes(y));S.last={p:i,c:[...c].sort((a,b)=>a-b)};
  if(i==0)sel.clear();snd(260,.09,'triangle');if(S.h[i].length==1){toast(NM[i]+' báo 1!');snd(880,.2,'triangle')}
  if(!S.h[i].length){S.over=1;S.w=i;if(G.mode=='sam'&&c.every(x=>x>>2==12))S.why='Về bằng quân 2: bị tính thối 2.';rend();flyPile(i);setTimeout(end,600);return''}
  adv();flyPile(i);return'';
}
function pass(i){
  if(S.over||S.dl||S.t!=i)return'Chưa đến lượt bạn.';
  if(!S.last)return'Bạn đang mở lượt, hãy đánh một bộ.';
  S.ps[i]=1;if(i==0)sel.clear();snd(180,.07);adv();return'';
}
function adv(){
  let j=S.t;do j=(j+1)%NP;while(S.ps[j]);
  if(S.last&&j==S.last.p){S.last=null;S.ps=Array(NP).fill(0);toast(NM[j]+' mở lượt mới')}
  S.t=j;rend();tick();
}
function bm(){
  const i=S.t,m=gen(S.h[i],S.last&&cls(S.last.c));
  if(!m.length){pass(i);return}
  if(LV==0){ if(S.last&&Math.random()<.35){pass(i);return} play(i,m[Math.random()*m.length|0]);return } // dễ: hơi ngẫu nhiên
  const k=c=>{const x=cls(c);return x.hi-(x.n-1)*3+(x.t=='q'||x.t=='dt'?200:0)};
  m.sort((a,b)=>k(a)-k(b));
  if(LV==2){ // khó: giữ heo/tứ quý, đánh mạnh khi đối thủ sắp hết bài
    const mn=Math.min(...S.h.filter((_,j)=>j!=i).map(h=>h.length));
    if(mn<=2&&S.last){play(i,m[m.length-1]);return}
    const safe=m.filter(c=>{const x=cls(c);return x.t!='q'&&x.t!='dt'&&!(x.hi>>2==12&&S.h[i].length>4)});
    if(safe.length){play(i,safe[0]);return}
    if(S.last&&mn>3){pass(i);return}
  }
  play(i,m[0]); // trung bình: đánh nhỏ nhất đủ chặn, như người chơi thường
}
function tick(){if(S.over||S.dl||S.t==0)return;const id=S.id;setTimeout(()=>{if(S.id==id&&!S.over&&!S.dl&&S.t!=0)bm()},pf.anim?900:250)}
function startGame(){
  if(G.mode=='phom')return pStart();
  const d=[...Array(52).keys()];for(let i=51;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]]}
  const cnt=G.mode=='sam'?10:13,h=Array.from({length:NP},(_,p)=>d.slice(p*cnt,p*cnt+cnt).sort((a,b)=>a-b)),f0=h.findIndex(x=>x.includes(0));
  S={h,t:fresh?(G.mode=='sam'?Math.random()*NP|0:Math.max(f0,0)):lastW,last:null,ps:Array(NP).fill(0),over:0,w:-1,dl:1,f3:fresh&&f0>=0&&G.mode!='sam'?1:0,n:cnt,id:Date.now(),why:'',sm:0};
  sel.clear();$('ov').hidden=1;$('ov').querySelectorAll('s').forEach(e=>e.remove());$('deck').classList.remove('gone');show('game');
  const tr=G.trang&&G.mode!='sam'?h.findIndex(x=>trang(x)):-1;if(tr>=0){S.over=1;S.w=tr;S.why='Tới trắng!'}
  startDeal();
}
function end(){
  lastW=S.w;fresh=0;
  const o=[...Array(NP).keys()].sort((a,b)=>a==S.w?-1:b==S.w?1:S.h[a].length-S.h[b].length);
  $('ov').hidden=0;
  $('ovc').innerHTML=`<h2>${S.w==0?'🎉 Bạn thắng!':'🏆 '+NM[S.w]+' thắng'}</h2><p>${S.why}</p><ol>${o.map(i=>`<li>${NM[i]} — còn ${S.h[i].length} lá${pen(i)}</li>`).join('')}</ol><div class="row"><button class="btn" id="oN">Ván tiếp</button><button class="btn o" id="oL">Về phòng</button><button class="btn o" id="oS">Chọn game khác</button></div>`;
  $('oN').onclick=startGame;$('oL').onclick=()=>{fresh=1;S.id=-1;toLob()};$('oS').onclick=()=>{fresh=1;S.id=-1;openMenu(gm)};
  [523,659,784,1047].forEach((f,k)=>snd(f,.25,'triangle',1,k*.12));
  if(pf.anim)for(let i=0;i<40;i++){const e=document.createElement('s');e.style.cssText=`left:${Math.random()*100}%;background:hsl(${Math.random()*360} 85% 60%);animation-delay:${Math.random()*.8}s`;$('ov').append(e)}
}


// Các trường hợp bị phạt theo luật (chỉ hiển thị, không tính tiền)
function pen(i){if(i==S.w)return'';const h=S.h[i],c=Array(13).fill(0);h.forEach(x=>c[x>>2]++);const t=[];
  if(c[12])t.push(c[12]>1&&G.mode=='nam'?'thối đôi 2':'thối 2');
  if(G.mode!='sam'&&c.slice(0,12).includes(4))t.push('thối tứ quý');
  if(h.length==S.n)t.push('cóng');return t.length?' · '+t.join(', '):''}
