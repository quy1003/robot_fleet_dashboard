# 🤖 Robot Fleet Dashboard

Hệ thống quản lý thời gian thực dành cho hạm đội Robot. Dự án này bao gồm Frontend (Next.js), Backend (Node.js/uWebSockets), Robot Simulator, cơ sở dữ liệu MongoDB và Redis Pub/Sub. Toàn bộ hệ thống đã được đóng gói bằng Docker.

## 🚀 Khởi chạy Nhanh bằng Docker Compose (Demo Mode)

Để khởi chạy toàn bộ hệ thống (bao gồm cả trình giả lập Robot tự động bắn dữ liệu), bạn chỉ cần cài đặt Docker Desktop và làm theo 2 bước đơn giản sau:

### Bước 1: Dừng các tiến trình cũ (nếu có)

### Bước 2: Chạy Docker Compose
Mở terminal tại thư mục gốc của dự án này và gõ lệnh sau:

```bash
docker compose up --build -d
```

Lệnh này sẽ tự động:
1. Tải và cấu hình **MongoDB** & **Redis**.
2. Xây dựng (build) image cho **Backend** và khởi chạy ở chế độ Đa luồng (Cluster).
3. Xây dựng image tĩnh cho **Frontend (Next.js)**.
4. Bật **Robot Simulator** để mô phỏng 5 con robot hoạt động và gửi dữ liệu liên tục lên Backend.

### Bước 3: Tận hưởng kết quả
Chờ một chút để quá trình build hoàn tất. Sau đó, hãy mở trình duyệt và truy cập vào:
👉 **[http://localhost:3000](http://localhost:3000)**

Bạn sẽ thấy giao diện Dashboard hiện ra với các chỉ số viễn thông của Robot thay đổi mượt mà theo thời gian thực!

---

## 🛑 Cách Dừng Hệ Thống

Để dừng và tắt toàn bộ hệ thống đang chạy ngầm, gõ lệnh:
```bash
docker compose down
```

Nếu bạn muốn xóa luôn cả dữ liệu (database volume của MongoDB) để reset lại từ đầu thì thêm cờ `-v`:
```bash
docker compose down -v
```

---

## 🔧 Dành cho Nhà Phát Triển (Chạy thủ công)
Nếu bạn muốn sửa code và chạy thủ công không qua Docker, hãy xem chi tiết cấu trúc hệ thống trong file `INSTRUCTIONS.md` hoặc xem README riêng tư ở hai thư mục `frontend` và `backend`.
