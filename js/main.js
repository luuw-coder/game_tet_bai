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
$('bSort').onclick=()=>{S.sm^=1;rend()};
$('bLeave').onclick=()=>{S.id=-1;fresh=1;toLob()};
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
