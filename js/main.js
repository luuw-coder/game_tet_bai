// main.js — Gắn sự kiện cho nút, kéo thả bài, vào màn chọn game.
$('goNam').onclick=()=>{fresh=1;show('lob')};$('back').onclick=()=>show('sel');$('start').onclick=startGame;
$('opts').onchange=e=>{G[e.target.name]=+e.target.checked};
$('bPlay').onclick=act;$('bPass').onclick=()=>{const r=pass(0);if(r)err(r)};
$('bSort').onclick=()=>{S.sm^=1;rend()};
$('bLeave').onclick=()=>{S.id=-1;fresh=1;show('lob')};
$('bSnd').onclick=e=>{pf.snd^=1;e.target.textContent=pf.snd?'🔊':'🔇'};
$('vol').oninput=e=>{pf.vol=e.target.value/100};
$('bAnim').onclick=e=>{pf.anim=!pf.anim;e.target.textContent='✨ Hiệu ứng: '+(pf.anim?'bật':'tắt')};
$('bAnim').textContent='✨ Hiệu ứng: '+(pf.anim?'bật':'tắt');
// Chạm/nhấp để chọn, kéo lá bài lên khu vực giữa bàn để đánh
$('hand').onpointerdown=e=>{
  const el=e.target.closest('.cd');if(!el||!S||S.over||S.dl||S.t!=0)return;
  const c=+el.dataset.c,x0=e.clientX,y0=e.clientY;let m=0;el.setPointerCapture(e.pointerId);
  el.onpointermove=v=>{const dx=v.clientX-x0,dy=v.clientY-y0;if(Math.abs(dx)+Math.abs(dy)>8)m=1;if(m){el.style.transition='none';el.style.zIndex=9;el.style.transform=`translate(${dx}px,${dy}px)`}};
  el.onpointerup=v=>{el.onpointermove=el.onpointerup=null;
    if(m&&y0-v.clientY>90){sel.add(c);act()}else if(!m){sel.has(c)?sel.delete(c):sel.add(c);snd(500,.04)}
    rend()};
};
show('sel');
