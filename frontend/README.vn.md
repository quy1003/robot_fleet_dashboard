# 🤖 Robot Fleet Dashboard - Frontend

Dự án này là giao diện điều khiển trung tâm (Dashboard) dành cho hệ thống Robot Fleet. Nó giúp người dùng theo dõi trực tiếp (real-time) trạng thái của hàng loạt robot trên bản đồ và biểu đồ.

## 🌟 Công nghệ sử dụng
- **Next.js 14 (App Router)**: Framework React hiện đại giúp tối ưu hóa hiệu suất và routing.
- **TypeScript**: Giúp code chặt chẽ, an toàn và dễ bảo trì.
- **Tailwind CSS**: Framework CSS tiện lợi giúp dựng giao diện cực nhanh và đẹp.
- **Recharts**: Thư viện vẽ biểu đồ chuyên nghiệp cho React.
- **Native WebSockets**: Kết nối trực tiếp với Backend để nhận dữ liệu liên tục mà không cần F5.

## 📂 Cấu trúc thư mục (Architecture)

```text
frontend/
├── src/
│   ├── app/                 # Chứa các trang (Pages) của Next.js
│   │   ├── layout.tsx       # Khung sườn chung của toàn bộ web
│   │   ├── page.tsx         # Trang chủ Dashboard hiển thị mọi thứ
│   │   └── globals.css      # File CSS tổng, chứa các mã màu chủ đạo
│   │
│   ├── components/          # Các mảnh ghép giao diện (UI Components)
│   │   ├── AppHeader.tsx    # Thanh điều hướng phía trên
│   │   ├── MainLayout.tsx   # Bố cục chính
│   │   ├── RobotCharts.tsx  # Biểu đồ hiển thị tình trạng Robot
│   │   └── SummaryCards.tsx # Các thẻ tóm tắt (Tổng số, Pin, Mạng...)
│   │
│   └── hooks/               # Các hàm logic dùng chung
│       └── useRobotsData.ts # Hàm móc nối (Hook) cực kỳ quan trọng:
│                            # 1. Gọi API lấy dữ liệu cũ
│                            # 2. Mở cổng kết nối WebSocket để nhận dữ liệu mới
│
├── .env.example             # File mẫu chứa các biến môi trường
└── package.json             # Danh sách thư viện cần thiết
```

## ⚙️ Luồng hoạt động (Data Flow)

1. **Khởi tạo (Initial Load):**
   - Khi bạn mở trình duyệt vào trang Dashboard, component `useRobotsData` sẽ chạy.
   - Nó lập tức gửi một yêu cầu HTTP (API REST) tới Backend để lấy "Bức ảnh chụp hiện tại" của tất cả các robot.

2. **Dòng chảy trực tiếp (Real-time Stream):**
   - Ngay sau khi lấy xong dữ liệu ban đầu, `useRobotsData` sẽ cắm một "ống nước" WebSocket tới Backend (`/ws/dashboard`).
   - Cứ mỗi 5 giây, khi Backend gom xong cục dữ liệu mới từ Robot, nó sẽ bơm dữ liệu đó qua ống nước này.
   - Frontend nhận được giọt nước mới (dữ liệu mới) -> Tự động kích hoạt React cập nhật lại toàn bộ Bảng biểu và Biểu đồ trên màn hình.

3. **Giao diện (UI Rendering):**
   - File `page.tsx` đóng vai trò là "Nhạc trưởng", lấy dữ liệu từ Hook `useRobotsData` và chia phát cho các nhạc công:
     - Chia số liệu tổng quan cho `SummaryCards`
     - Chia số liệu chi tiết cho `RobotCharts`

## 🚀 Hướng dẫn cài đặt và chạy thử

1. **Cài đặt thư viện:**
   Vào thư mục `frontend` và chạy:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường:**
   Copy file `.env.example` thành `.env.local` và điền thông tin:
   ```bash
   cp .env.example .env.local
   ```
   *Lưu ý: NEXT_PUBLIC_API_URL trỏ về cổng của Backend.*

3. **Chạy dự án:**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại `http://localhost:3000` để xem kết quả.

## 🧠 Tối ưu hóa (Performance Optimization) & Clean Code

Trong quá trình phát triển, giao diện đã được thiết kế lại (refactor) để đảm bảo hai yếu tố: **Hiệu năng cao** và **Dễ bảo trì**.

### 1. Kiến trúc Clean Code & Custom Hooks
- **Tách biệt Logic và UI:** Các logic xử lý phức tạp (gọi API, xử lý Websocket, quản lý state) được tách hoàn toàn ra khỏi các Component giao diện và đưa vào các **Custom Hooks** (như `useRobotsData`, `useRobotDetail`).
- **Component thuần túy (Dumb Components):** Các Component như `RobotTelemetryStats` hay `RobotHistoryCharts` chỉ làm nhiệm vụ nhận `props` và render JSX. Điều này giúp file code trở nên cực kỳ ngắn gọn, dễ đọc và dễ tái sử dụng.
- **Loại bỏ Magic Numbers/Strings:** Tất cả các trạng thái API (`success`, `error`), giới hạn số lượng, hoặc cấu hình biểu đồ đều được khai báo tập trung tại file `constants/config.ts`.

### 2. Tối ưu Hiệu năng Biểu đồ (Recharts)
- Khi nhận dữ liệu Websocket liên tục, biểu đồ (Charts) là thành phần dễ gây giật lag (lagging) nhất cho trình duyệt.
- **Data Downsampling:** Hệ thống tự động giới hạn số lượng điểm ảnh hiển thị trên biểu đồ (ví dụ: tối đa 120 điểm). Khi dữ liệu vượt quá, điểm cũ nhất sẽ bị cắt bỏ, giúp DOM không bị phình to.
- **Tắt hiệu ứng thừa:** Tắt các hiệu ứng hoạt ảnh (`isAnimationActive={false}`) của Recharts khi dữ liệu cập nhật theo thời gian thực để đảm bảo biểu đồ mượt mà, không bị khựng (stutter) khi có quá nhiều render cycle.
