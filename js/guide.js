// guide.js — thông tin từng game và hướng dẫn chơi chi tiết.
const GM={
 nam:{n:'Tiến lên miền Nam',ok:1,info:'Tiến lên miền Nam: 4 người, mỗi người 13 lá, ai hết bài trước thắng. Có chặt heo, tứ quý, đôi thông và tới trắng; chủ phòng chọn luật trước khi bắt đầu.'},
 bac:{n:'Tiến lên miền Bắc',ok:1,info:'Tiến lên miền Bắc: 4 người, 13 lá mỗi người. Không có đôi thông; chặn bài phải đồng chất (lẻ, sảnh) hoặc đồng màu (đôi). Luật mặc định có thể tắt đồng chất trong phòng.'},
 phom:{n:'Phỏm (Tá lả)',ok:0,info:'Phỏm (Tá lả): 4 người, bốc hoặc ăn bài để tạo phỏm, hạ phỏm, gửi bài, ù. Chế độ này đang được làm nên hiện chỉ xem được hướng dẫn.'}};
const GD={
nam:`<h3>Mục tiêu</h3><p>Đánh hết 13 lá trên tay trước ba người còn lại.</p>
<h3>Thứ tự lá bài</h3><p>Số: 3 &lt; 4 &lt; … &lt; K &lt; A &lt; 2 (2 gọi là heo, lớn nhất). Chất: ♠ &lt; ♣ &lt; ♦ &lt; ♥. Hai lá cùng số thì so theo chất.</p>
<h3>Các bộ bài</h3><ul><li>Lẻ, đôi, sám (3 lá cùng số), tứ quý.</li><li>Sảnh: từ 3 lá liên tiếp trở lên, không có quân 2.</li><li>Đôi thông: từ 3 đôi liên tiếp trở lên, không có quân 2.</li></ul>
<h3>Cách chơi</h3><ul><li>Người giữ 3♠ đi trước ở ván đầu và phải đánh kèm 3♠.</li><li>Lượt sau phải đánh cùng loại, cùng số lá và lớn hơn, hoặc bỏ lượt. Đã bỏ lượt thì phải chờ vòng mới.</li><li>Khi ba người còn lại đều bỏ, người đánh cuối cùng được mở vòng mới.</li></ul>
<h3>Chặt heo</h3><ul><li>3 đôi thông chặt 1 heo.</li><li>Tứ quý chặt 1 heo, đôi heo và 3 đôi thông.</li><li>4 đôi thông chặt heo, đôi heo, tứ quý và 3 đôi thông.</li></ul>
<h3>Tới trắng</h3><p>Nhận bài mà có tứ quý 2, sáu đôi hoặc sảnh rồng (3 đến A) thì thắng ngay. Chủ phòng có thể tắt.</p>
<h3>Cách thao tác</h3><p>Chạm lá bài để chọn (chạm lần nữa để bỏ chọn), bấm Đánh bài, hoặc kéo lá bài lên giữa bàn. Nút Sắp xếp đổi cách xếp bài.</p>`,
bac:`<h3>Mục tiêu</h3><p>Giống miền Nam: hết bài trước thắng. Bộ luật miền Bắc làm riêng, không dùng chung với miền Nam.</p>
<h3>Các bộ bài</h3><ul><li>Lẻ, đôi, sám cô (3 lá cùng số), tứ quý, sảnh (từ 3 lá liên tiếp, không có quân 2).</li><li>Không có đôi thông.</li></ul>
<h3>So sánh và chặn bài (mặc định)</h3><ul><li>Chỉ so theo số, chất không phân thứ bậc, nên hai lá cùng số không chặn được nhau.</li><li>Đồng chất: lá lẻ và sảnh phải cùng chất với bộ trước.</li><li>Đồng màu: đôi phải cùng màu (đen ♠♣ hoặc đỏ ♦♥) với đôi trước.</li><li>Tứ quý chặt được 1 heo và đôi heo; tứ quý lớn hơn chặn tứ quý nhỏ hơn.</li></ul>
<p>Luật miền Bắc khác nhau giữa các vùng và nhóm chơi, nên chủ phòng có thể tắt luật đồng chất/đồng màu.</p>
<h3>Cách chơi</h3><p>Người giữ 3♠ đi trước ở ván đầu. Các lượt sau đánh bộ cùng loại và cùng số lá để chặn, hoặc bỏ lượt. Ba người bỏ thì người đánh cuối mở vòng mới. Tới trắng (tứ quý 2, sáu đôi, sảnh rồng) thắng ngay nếu phòng bật.</p>`,
phom:`<h3>Chuẩn bị</h3><p>Bộ bài 52 lá, 4 người. Mỗi người 9 lá, người đi đầu có 10 lá. Bài còn lại úp thành nọc.</p>
<h3>Phỏm là gì</h3><ul><li>Phỏm ngang: 3 hoặc 4 lá cùng số (ví dụ 7♠ 7♥ 7♦).</li><li>Phỏm dọc: từ 3 lá liên tiếp cùng chất (ví dụ 4♣ 5♣ 6♣).</li></ul>
<h3>Một lượt</h3><p>Ăn lá người trước vừa đánh (nếu tạo được phỏm) hoặc bốc một lá từ nọc, rồi đánh một lá rác ra.</p>
<h3>Kết thúc</h3><p>Hạ phỏm, gửi bài vào phỏm hợp lệ của người khác, ù khi hết bài rác. Điểm tính theo các lá rác còn lại, ít điểm là tốt. Cách tính chi tiết sẽ có khi chế độ này hoàn thành.</p>`};
