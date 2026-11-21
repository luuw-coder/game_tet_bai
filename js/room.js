// room.js — menu game, phòng chờ, bot, hướng dẫn. (Phòng thật sẽ thay bằng Firebase.)
let seats=[],wt0=0,wtI=0,gm='nam';
function openMenu(g){gm=g;G.mode=g;NP=g=='sam'?5:4;$('mT').textContent=GM[g].n;$('mInfo').textContent=GM[g].info;$('mCreate').disabled=!GM[g].ok;$('mCreate').textContent=GM[g].ok?'🎮 Tạo phòng để chơi':'🎮 Tạo phòng (sắp có)';$('jm').textContent='';show('menu')}
function newRoom(){seats=['Bạn',...Array(NP-1).fill(null)];$('code').textContent='TET-'+(1000+Math.random()*9000|0);wt0=Date.now();toLob()}
function toLob(){show('lob');$('lT').textContent='Phòng chờ · '+GM[gm].n;lobR();renderOpts();clearInterval(wtI);const t=()=>{const s=(Date.now()-wt0)/1000|0;$('wt').textContent='⏱ Đã chờ '+String(s/60|0).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};t();wtI=setInterval(t,1000)}
function lobR(){const n=seats.filter(x=>!x).length;
  $('seatsL').innerHTML=seats.map((x,i)=>`<div class="sc${x?' ok':''}">${x?(i?'🙂':'👑'):'➕'}<br><b>${x||'Trống'}</b><br><span class="note">${i==0?'Chủ phòng':x?'Đã vào':'Trống · bot sẽ thay'}</span></div>`).join('');
  $('bBot').textContent=n?`🤖 Chơi với bot (${n} bot thay người còn thiếu)`:'▶ Bắt đầu ván';
  $('link').value=location.href.split('#')[0]+'#/'+gm+'/'+$('code').textContent}
function renderOpts(){const T=[['trang','Tới trắng (tứ quý 2, sáu đôi, sảnh rồng)']],o=gm=='nam'?[['chat','Chặt heo (3 đôi thông / tứ quý / 4 đôi thông)'],['quad','Tứ quý được dùng để chặt'],['dt','Ba đôi thông được dùng để chặt heo'],['quad22','Tứ quý chặt được cả đôi heo']].concat(T):gm=='bac'?[['dc','Đồng chất (lẻ, sảnh) và đồng màu (đôi) khi chặn bài']].concat(T):[];
  $('opts').innerHTML='<b>Luật phòng</b>'+(o.length?o.map(([k,t])=>`<label><input type="checkbox" name="${k}" ${G[k]?'checked':''}> ${t}</label>`).join(''):'<p class="note">'+(gm=='phom'?'Luật cơ bản: mỗi người đánh 4 lá, ù thì thắng ngay, hết lượt thì tự hạ phỏm, gửi bài và xếp hạng theo điểm rác.':'Luật cơ bản: không phân chất, tứ quý chặt 1 heo, về bằng quân 2 bị thối 2.')+'</p>')}
function begin(){ // người còn thiếu được thay bằng bot theo cấp độ đã chọn
  LV=+document.querySelector('input[name=lv]:checked').value;const L=['Dễ','Thường','Khó'][LV];
  seats.forEach((x,i)=>{NM[i]=x||'Máy '+(i+1)+' ('+L+')';AV[i]=i==0?'🧑':x?'🙂':'🤖'});
  $('gt').textContent=GM[gm].n;fresh=1;startGame()}
function openGuide(g){$('gC').innerHTML='<h2>'+GM[g].n+'</h2>'+GD[g];$('gd').hidden=0}
