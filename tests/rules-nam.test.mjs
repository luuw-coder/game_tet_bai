import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const src = readFileSync(new URL('../js/rules-nam.js', import.meta.url), 'utf8');
const { cls, beats, trang } = vm.runInNewContext(src + ';({cls,beats,trang})', {});
const K = (r, s = 0) => r * 4 + s; // r: 0=3 … 11=A, 12=2 ; s: 0♠ 1♣ 2♦ 3♥
const G = { chat: 1, quad: 1, dt: 1 };
const dt = (a, k) => Array.from({ length: k }, (_, i) => [K(a + i), K(a + i, 1)]).flat();
const B = (p, c, g = G) => beats(cls(p), cls(c), g);

test('phân loại bộ bài', () => {
  assert.equal(cls([K(0)]).t, 's');
  assert.equal(cls([K(5), K(5, 1)]).t, 'p');
  assert.equal(cls([K(5), K(5, 1), K(5, 2)]).t, 't');
  assert.equal(cls([0, 1, 2, 3].map(s => K(7, s))).t, 'q');
  assert.equal(cls([K(0), K(1), K(2)]).t, 'st');
  assert.equal(cls(dt(0, 3)).t, 'dt');
  assert.equal(cls(dt(0, 4)).k, 4);
});
test('bộ không hợp lệ', () => {
  assert.equal(cls([]), null);
  assert.equal(cls([K(0), K(2)]), null);
  assert.equal(cls([K(0), K(1)]), null);
  assert.equal(cls([K(10), K(11), K(12)]), null, 'quân 2 không nằm trong sảnh');
  assert.equal(cls(dt(10, 3)), null, 'đôi thông không có 2');
});
test('so sánh cùng loại', () => {
  assert.ok(B([K(3)], [K(4)]));
  assert.ok(B([K(12)], [K(12, 3)]), '2♥ > 2♠');
  assert.ok(!B([K(4)], [K(3)]));
  assert.ok(B([K(0), K(1), K(2)], [K(1), K(2), K(3)]));
  assert.ok(!B([K(0), K(1), K(2)], [K(0), K(1), K(2), K(3)]), 'sảnh khác độ dài');
  assert.ok(!B([K(3)], [K(3), K(3, 1)]), 'khác loại không chặn');
});
test('chặt heo / tứ quý / đôi thông', () => {
  const q = [0, 1, 2, 3].map(s => K(5, s));
  assert.ok(B([K(12)], dt(0, 3)), '3 đôi thông chặt 1 heo');
  assert.ok(B([K(12)], q), 'tứ quý chặt 1 heo');
  assert.ok(B([K(12), K(12, 1)], q), 'tứ quý chặt đôi heo');
  assert.ok(!B([K(12), K(12, 1)], dt(0, 3)), '3 đôi thông không chặt đôi heo');
  assert.ok(B([K(12), K(12, 1)], dt(0, 4)), '4 đôi thông chặt đôi heo');
  assert.ok(B(q, dt(0, 4)), '4 đôi thông chặt tứ quý');
  assert.ok(!B(dt(0, 4), q));
  assert.ok(!B([K(8)], q), 'không chặt quân thường');
});
test('tùy chọn luật phòng', () => {
  assert.ok(!B([K(12)], dt(0, 3), { chat: 0, quad: 1, dt: 1 }), 'tắt chặt heo');
  assert.ok(!B([K(12)], dt(0, 3), { chat: 1, quad: 1, dt: 0 }), 'tắt đôi thông chặt heo');
  assert.ok(!B([K(12)], [0, 1, 2, 3].map(s => K(5, s)), { chat: 1, quad: 0, dt: 1 }), 'tắt tứ quý chặt');
});
test('tới trắng', () => {
  const rest = [K(0), K(1), K(2), K(3), K(4), K(5), K(6), K(7), K(8)];
  assert.ok(trang([0, 1, 2, 3].map(s => K(12, s)).concat(rest)), 'tứ quý 2');
  assert.ok(trang(Array.from({ length: 13 }, (_, r) => K(r))), 'sảnh rồng');
  assert.ok(trang([0, 1, 2, 3, 4, 5].flatMap(r => [K(r), K(r, 1)]).concat([K(8)])), 'sáu đôi');
  assert.ok(!trang([K(0), K(0, 1), K(2), K(3), K(5), K(6), K(7), K(9), K(10), K(11), K(12), K(8), K(4, 2)]));
});
