import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const src = readFileSync(new URL('../js/phom.js', import.meta.url), 'utf8').replace(/^let /gm, 'var ');
const { nat, bestMelds, canEat, canAdd, allMelds, pv } = vm.runInNewContext(src + ';({nat,bestMelds,canEat,canAdd,allMelds,pv})', {});
// lá: số tự nhiên n (A=1…K=13), chất s (0♠ 1♣ 2♦ 3♥). id Tiến lên: rank=(n+10)%13
const C = (n, s) => ((n + 10) % 13) * 4 + s;
test('quy đổi số và điểm', () => { assert.equal(nat(C(1, 0)), 1); assert.equal(nat(C(13, 2)), 13); assert.equal(pv(C(12, 1)), 12); });
test('phỏm ngang và phỏm dọc', () => {
  const h = [C(7, 0), C(7, 3), C(7, 2), C(4, 1), C(5, 1), C(6, 1), C(9, 0)];
  const b = bestMelds(h); assert.equal(b.m.length, 2); assert.equal(b.m.flat().includes(C(9, 0)), false);
});
test('phỏm 4 lá và không nối vòng K-A-2', () => {
  assert.ok(allMelds([0, 1, 2, 3].map(s => C(9, s)).concat([C(1, 0), C(2, 0), C(3, 0)])));
  assert.equal(bestMelds([C(12, 0), C(13, 0), C(1, 0)]).m.length, 0);
});
test('ăn bài chỉ khi tạo được phỏm', () => {
  assert.ok(canEat([C(4, 1), C(5, 1), C(9, 0)], C(6, 1)));
  assert.ok(canEat([C(7, 0), C(7, 3)], C(7, 2)));
  assert.ok(!canEat([C(4, 1), C(5, 2), C(9, 0)], C(6, 1)));
});
test('gửi bài chỉ vào phỏm hợp lệ', () => {
  assert.ok(canAdd([C(4, 1), C(5, 1), C(6, 1)], C(7, 1)));
  assert.ok(canAdd([C(4, 1), C(5, 1), C(6, 1)], C(3, 1)));
  assert.ok(!canAdd([C(4, 1), C(5, 1), C(6, 1)], C(7, 2)), 'khác chất');
  assert.ok(!canAdd([C(4, 1), C(5, 1), C(6, 1)], C(8, 1)));
  assert.ok(canAdd([C(7, 0), C(7, 3), C(7, 2)], C(7, 1)));
  assert.ok(!canAdd([0, 1, 2, 3].map(s => C(7, s)), C(7, 1)), 'phỏm 4 lá đã đủ');
});
