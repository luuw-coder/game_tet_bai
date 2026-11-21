// main.js — gắn sự kiện: điều hướng, phòng, chat, hướng dẫn, điều khiển ván, kéo thả bài.
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>openMenu(b.dataset.m));
document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>openGuide(b.dataset.q));
$('mBack').onclick=()=>show('sel');$('mGuide').onclick=()=>openGuide(gm);$('lGuide').onclick=()=>openGuide(gm);$('bHelp').onclick=()=>openGuide(gm);
$('gX').onclick=()=>{$('gd').hidden=1};$('gd').onclick=e=>{if(e.target==$('gd'))$('gd').hidden=1};
$('mCreate').onclick=newRoom;$('lBack').onclick=()=>{clearInterval(wtI);openMenu(gm)};
$('bBot').onclick=begin;
$('bCopy').onclick=async e=>{const b=e.target;try{await navigator.clipboard.writeText($('link').value);b.textContent='Đã chép ✓'}catch(x){$('link').select();b.textContent='Hãy chép tay'}setTimeout(()=>b.textContent='Chép liên kết',1500)};
$('goJoin').onclick=()=>{const v=$('jc').value.trim().toUpperCase();$('jm').textContent=v?`Chưa nối Firebase nên chưa vào được phòng ${v}. Khi nối xong, mã này sẽ đưa bạn đúng vào phòng của bạn bè.`:'Hãy nhập mã phòng.'};
$('opts').onchange=e=>{G[e.target.name]=+e.target.checked};
$('chatT').onclick=()=>{$('chatB').hidden=!$('chatB').hidden};
$('bPlay').onclick=act;$('bPass').onclick=()=>{const r=pass(0);if(r)err(r)};
$('bSort').onclick=()=>{const o=G.mode=='phom'?PH:S;o.sm=((o.sm||0)+1)%3;$('bSort').textContent='Xếp: '+['số','chất','bộ'][o.sm];rend()};
$('bLeave').onclick=()=>{if(S)S.id=-1;if(PH)PH.id=-1;fresh=1;toLob()};
$('bSnd').onclick=e=>{pf.snd^=1;e.target.textContent=pf.snd?'🔊':'🔇'};
$('vol').oninput=e=>{pf.vol=e.target.value/100};
$('bAnim').onclick=e=>{pf.anim=!pf.anim;e.target.textContent='✨ Hiệu ứng: '+(pf.anim?'bật':'tắt')};
$('bAnim').textContent='✨ Hiệu ứng: '+(pf.anim?'bật':'tắt');
// Nhấn chọn lá, nhấn lần nữa để đánh, hoặc vuốt ra giữa bàn. Ctrl/Shift (hoặc nút Chọn nhiều) để chọn nhiều lá.
let multi=0;
$('bMulti').onclick=e=>{multi^=1;e.target.textContent=multi?'☑ Chọn nhiều':'☐ Chọn nhiều'};
$('bDraw').onclick=()=>{const r=pDraw(0);if(r)err(r)};$('bEat').onclick=()=>{const r=pEat(0);if(r)err(r)};
$('deck').onclick=()=>{if(G.mode=='phom'&&PH&&PH.t==0){const r=pDraw(0);if(r)err(r)}};
function tapCard(c,m){
  if(sel.has(c)){if(m){sel.delete(c);rend()}else act();return}
  if(!m)sel.clear();sel.add(c);snd(500,.04);rend()}
$('hand').onpointerdown=e=>{
  const el=e.target.closest('.cd');if(!el)return;
  const c=+el.dataset.c,x0=e.clientX,y0=e.clientY,m=e.ctrlKey||e.shiftKey||e.metaKey||multi;let mv=0;
  el.setPointerCapture(e.pointerId);
  el.onpointermove=v=>{const dx=v.clientX-x0,dy=v.clientY-y0;if(Math.hypot(dx,dy)>10)mv=1;
    if(mv)document.querySelectorAll('#hand .cd.sel,#hand .cd[data-c="'+c+'"]').forEach(k=>{k.style.transition='none';k.style.zIndex=9;k.style.transform=`translate(${dx}px,${dy}px)`})};
  el.onpointerup=v=>{el.onpointermove=el.onpointerup=null;
    if(!mv)tapCard(c,m);
    else if(y0-v.clientY>70){if(!sel.has(c)){if(!m)sel.clear();sel.add(c)}act()}
    rend()};
};
show('sel');
