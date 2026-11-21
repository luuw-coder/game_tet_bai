// guide.js — thông tin từng game và hướng dẫn chơi (theo tài liệu luật của chủ dự án).
const GM={
 nam:{n:'Tiến lên miền Nam',ok:1,info:'Tiến lên miền Nam: 4 người, bộ bài 52 lá, mỗi người 13 lá, ai hết bài trước thắng. Có chặt heo, tứ quý, đôi thông, tới trắng; chủ phòng chọn luật trước khi bắt đầu.'},
 bac:{n:'Tiến lên miền Bắc',ok:1,info:'Tiến lên miền Bắc: 4 người, 13 lá mỗi người. Đôi cùng màu, sảnh cùng chất, lẻ phải cùng chất; không có đôi thông. Luật đồng chất/đồng màu có thể tắt trong phòng.'},
 phom:{n:'Phỏm (Tá lả)',ok:0,info:'Phỏm (Tá lả): tối đa 4 người, bộ bài 52 lá, ăn bài hoặc bốc nọc để tạo phỏm, hạ phỏm, gửi bài, ù. Chế độ này đang được làm nên hiện chỉ xem được hướng dẫn.'},
 sam:{n:'Sâm lốc',ok:1,info:'Sâm lốc: bộ bài 52 lá, mỗi người 10 lá, đánh hết bài trước thắng, không phân biệt chất. Phòng hiện có 4 người; báo sâm, xin làng và chặt chồng sẽ có sau.'}};
const GD={
nam:`<h3>Bộ bài</h3><p>52 lá, 4 người, mỗi người 13 lá. Thứ tự: 3 &lt; 4 &lt; … &lt; K &lt; A &lt; 2 (2 là heo). Hai lá cùng số thì so theo chất ♠ &lt; ♣ &lt; ♦ &lt; ♥.</p>
<h3>Các bộ hợp lệ</h3><ul><li>Lẻ (1 lá), đôi (2 lá cùng số), sám cô (3 lá cùng số), tứ quý (4 lá cùng số).</li><li>Sảnh: từ 3 lá liên tiếp, không cần cùng chất, không có quân 2.</li><li>3 đôi thông, 4 đôi thông: các đôi có số liên tiếp.</li></ul>
<h3>Cách chơi</h3><p>Người giữ 3♠ đi trước ở ván đầu, nước đầu phải có 3♠. Lượt sau đánh cùng loại, cùng số lá và lớn hơn, hoặc bỏ lượt (bỏ rồi phải chờ vòng mới). Ba người bỏ thì người đánh cuối mở vòng mới. Ai hết bài trước thắng.</p>
<h3>Luật chặt</h3><ul><li>3 đôi thông chặt 1 lá 2 hoặc 3 đôi thông nhỏ hơn.</li><li>Tứ quý chặt 1 lá 2 hoặc 3 đôi thông. Chặt đôi 2 là tùy chọn của phòng.</li><li>4 đôi thông chặt 1 lá 2, đôi 2, 3 đôi thông, tứ quý hoặc 4 đôi thông nhỏ hơn.</li></ul>
<h3>Các trường hợp bị phạt (hiện ở bảng kết quả, không tính tiền)</h3><ul><li>Thối 2, thối đôi 2: còn quân 2 khi ván kết thúc.</li><li>Thối tứ quý, thối đôi thông: còn giữ khi ván kết thúc (nếu bàn bật).</li><li>Cóng: chưa đánh được lá nào.</li><li>Tới trắng: nhận bài có tứ quý 2, sáu đôi hoặc sảnh rồng thì thắng ngay (nếu bàn bật).</li></ul>
<h3>Thao tác</h3><p>Chạm lá bài để chọn, chạm lần nữa để bỏ chọn, rồi bấm Đánh bài. Có thể kéo lá bài lên giữa bàn để đánh.</p>`,
bac:`<h3>Bộ bài</h3><p>52 lá, 4 người, mỗi người 13 lá. Số từ 3 đến 2. Người hết bài đầu tiên thắng.</p>
<h3>Các bộ</h3><ul><li>Lẻ: 1 lá. Đôi: 2 lá cùng số, cùng màu. Sám cô: 3 lá cùng số. Tứ quý: 4 lá cùng số.</li><li>Sảnh: từ 3 lá liên tiếp, cùng chất.</li><li>Không dùng 3 đôi thông, 4 đôi thông như miền Nam.</li></ul>
<h3>Luật đánh và chặt</h3><ul><li>Đánh sau phải cùng loại bộ và lớn hơn bộ trước.</li><li>Lẻ phải cùng chất và lớn hơn lá trước. Đôi phải cùng màu. Sảnh phải cùng chất.</li><li>Tứ quý chặt được 1 lá 2.</li></ul>
<h3>Các trường hợp bị phạt</h3><ul><li>Thối 2: còn giữ quân 2 khi ván kết thúc.</li><li>Thối tứ quý nếu bàn bật quy tắc này.</li><li>Bị chặt 2 bằng tứ quý.</li></ul>
<p>Luật miền Bắc khác nhau theo vùng nên chủ phòng có thể tắt luật đồng chất/đồng màu. Bộ luật này làm riêng, không dùng chung với miền Nam.</p>`,
phom:`<h3>Chia bài</h3><ul><li>Bộ bài 52 lá, tối đa 4 người.</li><li>Người chia nhận 10 lá, những người còn lại 9 lá. Bài dư làm nọc ở giữa bàn. Người có 10 lá đánh trước.</li></ul>
<h3>Các bộ phỏm</h3><ul><li>Phỏm ngang: 3 hoặc 4 lá cùng số (7♠ 7♥ 7♦).</li><li>Phỏm dọc: từ 3 lá liên tiếp cùng chất (4♥ 5♥ 6♥).</li></ul>
<h3>Cách chơi</h3><ol><li>Người đầu tiên đánh một lá rác.</li><li>Người kế tiếp ăn lá đó nếu tạo được phỏm, hoặc bốc một lá từ nọc.</li><li>Sau đó đánh ra một lá.</li><li>Cứ theo vòng cho đến khi kết thúc 4 lượt.</li><li>Hạ phỏm, rồi gửi lá phù hợp vào phỏm đã hạ.</li><li>Nếu có người ù thì ván kết thúc ngay.</li></ol>
<h3>Các trường hợp phạt</h3><ul><li>Ăn bài: người đánh lá bị ăn chịu phạt. Ăn chốt: ăn lá cuối của vòng cuối, phạt nặng hơn.</li><li>Đền: chịu phạt thay người khác (đền làng).</li><li>Móm: kết thúc ván mà không có phỏm. Ù: mọi lá đều nằm trong phỏm, thắng ngay.</li></ul><p>Ăn chốt và đền làng có nhiều cách áp dụng nên sẽ cho bật/tắt trong phòng.</p>`,
sam:`<h3>Thông số</h3><p>Bộ bài 52 lá, mỗi người 10 lá (5 người thì dư 2 lá úp). Mục tiêu: đánh hết bài trước. Thứ tự số: 3 &lt; 4 &lt; … &lt; A &lt; 2. Sâm lốc thường không phân biệt chất khi so bài.</p>
<h3>Các bộ</h3><ul><li>Lẻ, đôi, sám cô, tứ quý.</li><li>Sảnh: từ 3 lá liên tiếp, không cần cùng chất (4♠ 5♥ 6♦).</li><li>Bộ đánh sau phải cùng loại và lớn hơn bộ trước.</li></ul>
<h3>Luật đã có trong game</h3><ul><li>Chặt 2: tứ quý chặt 1 lá 2.</li><li>Báo 1: khi còn 1 lá, game thông báo cho cả bàn.</li><li>Thối 2: về bằng quân 2 hoặc còn 2 khi ván kết thúc bị tính thối 2.</li><li>Cóng: không đánh được lá nào trước khi người khác về.</li></ul>
<h3>Chưa có (sẽ làm sau)</h3><p>Báo sâm, ăn sâm, xịt sâm, xin làng, chặn báo 1, chặt chồng, và chơi 5 người.</p>`};
