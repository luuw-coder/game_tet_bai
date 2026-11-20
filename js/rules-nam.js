// rules-nam.js — LUẬT Tiến lên miền Nam (không đụng DOM, có test trong tests/).
/* ===== RULES ENGINE: Tiến lên miền Nam (độc lập với giao diện) ===== */
// Thứ tự: 3<4<…<K<A<2; chất ♠<♣<♦<♥. Quân = rank*4+chất.
function cls(cs){
  const a=[...cs].sort((x,y)=>x-y),n=a.length;if(!n)return null;
  const r=a.map(c=>c>>2),hi=a[n-1];
  if(r.every(x=>x==r[0])&&n<=4)return{t:['','s','p','t','q'][n],n,hi};
  if(r.includes(12))return null; // quân 2 không nằm trong sảnh / đôi thông
  if(n>=3&&r.every((x,i)=>!i||x==r[i-1]+1))return{t:'st',n,hi};
  if(n>=6&&n%2==0&&r.every((x,i)=>i%2?x==r[i-1]:(!i||x==r[i-1]+1)))return{t:'dt',n,hi,k:n/2};
  return null;
}
function beats(p,c,g){
  if(!p)return true;
  if(c.t==p.t&&c.n==p.n)return c.hi>p.hi;
  if(!g.chat)return false;
  const f=x=>x.t=='dt'?(x.k>3?'D':'d'):x.t=='q'?'q':'';
  const two=x=>x.hi>>2==12,w=x=>two(x)&&x.t=='s'?'2':two(x)&&x.t=='p'?'22':f(x);
  const need={'2':'dqD','22':'qD',d:'qD',q:'D'}[w(p)],m=f(c);
  return !!need&&!!m&&need.includes(m)&&(m!='q'||!!g.quad)&&(m!='d'||!!g.dt);
}
function trang(h){const c=Array(13).fill(0);h.forEach(x=>c[x>>2]++);return c[12]==4||c.slice(0,12).every(x=>x>0)||c.reduce((s,x)=>s+(x>>1),0)>=6}
function gen(h,p){ // mọi nước hợp lệ cho bot
  const by={},o=[];h.forEach(c=>(by[c>>2]??=[]).push(c));
  const cb=(a,k,s=0,cur=[])=>{if(cur.length==k){o.push([...cur]);return}for(let i=s;i<a.length;i++){cur.push(a[i]);cb(a,k,i+1,cur);cur.pop()}};
  for(const r in by)for(let k=1;k<=by[r].length;k++)cb(by[r],k);
  for(let s=0;s<=9;s++){const lo=[],hi=[],pl=[],ph=[];
    for(let r=s;r<=11&&by[r];r++){const L=r-s+1;lo.push(by[r][0]);hi.push(by[r].at(-1));
      if(by[r].length>1){pl.push(...by[r].slice(0,2));ph.push(...by[r].slice(-2))}
      if(L>=3){o.push([...lo],[...hi]);if(pl.length==2*L)o.push([...pl],[...ph])}}}
  return o.filter(c=>{const x=cls(c);return x&&beats(p,x,G)&&(!S.f3||c.includes(0))});
}

