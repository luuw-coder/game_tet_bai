# Game bài Tết (bản thử nghiệm)

Tiến lên miền Nam chơi được với 3 máy. Miền Bắc và Phỏm chưa làm. **Chưa có multiplayer thật.**

## Cấu trúc
```
(gốc repo)
  index.html
  css/style.css
  js/core.js         hằng số, trạng thái chung
  js/rules-nam.js    LUẬT miền Nam (không đụng DOM)
  js/game-state.js   chia bài, đánh, bỏ lượt, bot, kết thúc
  js/ui.js           vẽ bàn, hoạt ảnh, âm thanh
  js/room.js         phòng chờ (tạm, sẽ thay bằng Firebase)
  js/main.js         gắn sự kiện, kéo thả
tests/rules-nam.test.mjs   kiểm thử luật (6 nhóm, đều đạt)
```
Các file JS nạp theo đúng thứ tự trong index.html (dùng chung biến toàn cục, chưa dùng import).

## Chạy thử
- Trên máy: mở thư mục `game-bai`, chạy `npx serve .` rồi mở địa chỉ hiện ra (hoặc bấm đúp `index.html`).
- Test luật: `node --test tests/rules-nam.test.mjs`

## Đưa lên GitHub cùng web hiện tại
1. Chép thư mục `game-bai` vào `public/game-bai` của dự án `game-tet`.
2. Chép `tests/` vào gốc dự án. Commit và push nhánh `main`.
3. Workflow deploy hiện có sẽ tự build. Địa chỉ: `https://<tên-github>.github.io/<tên-repo>/game-bai/`

## Việc tiếp theo
- Miền Bắc, Phỏm (mỗi chế độ một file luật riêng).
- Multiplayer: dùng UID và `displayName` của web, thay 3 máy bằng người thật.
  Muốn chia bài và kiểm tra luật ở máy chủ (không lộ bài, chống gian lận) cần Firebase Cloud Functions, tức gói **Blaze**.
  Luật Firestore hiện khóa ghi `rooms`, sẽ cần mở lại theo từng bước.
- Test multiplayer bằng 4 tài khoản thật chỉ làm được sau khi nối Firebase.
