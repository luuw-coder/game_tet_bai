// room.js — Phòng chờ: mã phòng, liên kết mời, ghế trống. (Sẽ thay bằng Firebase.)
/* ===== Phòng: tạo phòng, mã/liên kết mời, ghế trống ===== */
let seats=[1,0,0,0],cv='sel';
function lobR(){$('seatsL').innerHTML=[0,1,2,3].map(i=>`<div class="sc${seats[i]?' me':''}">${seats[i]?AV[i]:'➕'}<br><b>${seats[i]?NM[i]:'Ghế trống'}</b><br><span class="note">${i==0?'Chủ phòng':seats[i]?'Máy (thử nghiệm)':'Chờ người vào'}</span></div>`).join('');$('start').disabled=seats.some(x=>!x);$('link').value=location.href.split('#')[0]+'#/nam/'+$('code').textContent}
const sh0=show;
show=v=>{const c=$('code').textContent;sh0(v);if(v=='lob'){if(cv=='game'&&c)$('code').textContent=c;else seats=[1,0,0,0];lobR()}cv=v};
$('bBot').onclick=()=>{seats=[1,1,1,1];lobR()};
$('bCopy').onclick=async e=>{const b=e.target;try{await navigator.clipboard.writeText($('link').value);b.textContent='Đã chép ✓'}catch(x){$('link').select();b.textContent='Hãy chép tay'}setTimeout(()=>b.textContent='Chép liên kết',1500)};
$('goJoin').onclick=()=>{const v=$('jc').value.trim().toUpperCase();$('jm').textContent=v?`Bản thử nghiệm chưa có phòng thật nên chưa vào được ${v}. Khi nối Firebase, mã này sẽ đưa bạn đúng vào phòng của bạn bè.`:'Hãy nhập mã phòng.'};
/* Bài bay theo đường cong, nảy nhẹ khi chạm bàn */
function fly(e,f,ms=320,d=0){if(!pf.anim||!e)return;const t=ctr(e),r=(Math.random()-.5)*50;e.animate([{transform:`translate(${f.x-t.x}px,${f.y-t.y}px) scale(.45) rotate(${r}deg)`,opacity:.2,filter:'brightness(1.5)'},{transform:`translate(0,-12px) scale(1.12) rotate(${-r/6}deg)`,opacity:1,filter:'brightness(1.15)',offset:.72},{transform:'none',opacity:1,filter:'none'}],{duration:ms*1.2,delay:d,easing:'cubic-bezier(.22,.9,.3,1)',fill:'backwards'})};

