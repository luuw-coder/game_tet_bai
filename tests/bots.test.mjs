// Mô phỏng nhiều ván bot-vs-bot (không cần trình duyệt): ván phải kết thúc, bot không đi nước sai.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const mk = () => new Proxy(function () {}, {
  get: (t, k) => k === Symbol.toPrimitive ? () => 0 : k === Symbol.iterator ? function* () {} : k === 'length' ? 0 : k in t ? t[k] : (t[k] = mk()),
  set: (t, k, v) => (t[k] = v, true), apply: () => mk(),
});
const ctx = vm.createContext({ document: { getElementById: mk, body: mk(), createElement: mk, querySelectorAll: () => [], querySelector: mk }, matchMedia: () => ({ matches: true }), setTimeout: () => 0, clearInterval() {}, clearTimeout() {}, setInterval: () => 0, location: { href: 'x' }, Math, Date, Set, Array });
for (const f of ['core', 'rules-nam', 'game-state', 'ui', 'guide', 'room'])
  vm.runInContext(readFileSync(new URL(`../js/${f}.js`, import.meta.url), 'utf8').replace(/^(let|const) /gm, 'var '), ctx);
const run = (mode, lv) => vm.runInContext(`(()=>{G.mode='${mode}';LV=${lv};G.trang=0;const bad=[],p0=play;play=(i,c)=>{const r=p0(i,c);if(r)bad.push(r);return r};
 let fin=0;for(let g=0;g<150;g++){fresh=g%2?0:1;startGame();S.dl=0;let n=0;while(!S.over&&n++<3000)bm();if(S.over)fin++}
 play=p0;return{fin,bad:bad.slice(0,3)}})()`, ctx);
for (const mode of ['nam', 'bac']) for (const lv of [0, 1, 2])
  test(`bot ${mode} cấp ${lv}: 150 ván đều kết thúc, không nước sai`, () => {
    const r = run(mode, lv);
    assert.equal(r.bad.length, 0, JSON.stringify(r.bad));
    assert.equal(r.fin, 150);
  });
