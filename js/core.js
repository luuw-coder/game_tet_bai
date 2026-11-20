// core.js — Hằng số, trạng thái toàn cục, cấu hình người chơi.
const $=i=>document.getElementById(i),R='3 4 5 6 7 8 9 10 J Q K A 2'.split(' '),SU='♠♣♦♥',NM=['Bạn','Bác Tư','Cô Hai','Chú Ba'],AV=['🧑','👴','👩','👦'],POS=['b','r','t','l'],TN={s:'Lẻ',p:'Đôi',t:'Ba lá',q:'Tứ quý',st:'Sảnh',dt:'Đôi thông'};
let LV=1,cv='sel',S=null,G={chat:1,quad:1,dt:1,trang:1,dc:1,mode:'nam'},sel=new Set(),fresh=1,lastW=0,pf={snd:1,vol:.5,anim:!matchMedia('(prefers-reduced-motion: reduce)').matches};
const red=c=>(c&3)>1;

