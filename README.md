# ChatWeb - Realtime Chat Application

## Giới thiệu
ChatWeb là một ứng dụng nhắn tin theo thời gian thực (Realtime Chat Application) được xây dựng với mục đích cung cấp trải nghiệm trò chuyện mượt mà và nhanh chóng giữa các người dùng thông qua các phòng chat (rooms).

## Công nghệ sử dụng

### Frontend
- **React.js** (Khởi tạo bằng Vite)
- **Tailwind CSS**: Thiết kế giao diện hiện đại và nhanh chóng
- **Framer Motion**: Tích hợp các hiệu ứng chuyển động mượt mà
- **Socket.io-client**: Kết nối và nhận/gửi dữ liệu thời gian thực với server

### Backend
- **Node.js** & **Express.js**: Xây dựng máy chủ web
- **Socket.io**: Xử lý giao tiếp WebSocket đa chiều
- **MySQL**: Cơ sở dữ liệu lưu trữ thông tin người dùng và lịch sử tin nhắn

## Chức năng chính
- 🔐 Đăng ký và đăng nhập tài khoản.
- 👤 Cập nhật hồ sơ người dùng (Ảnh đại diện, Tên hiển thị).
- 🏠 Tạo và tham gia các phòng chat.
- 💬 Nhắn tin thời gian thực với Socket.io.
- 🗄️ Lưu trữ và tải lại lịch sử tin nhắn của từng phòng.

## Hướng dẫn cài đặt và chạy dự án tại Local

### 1. Clone dự án
```bash
git clone https://github.com/tranvanminhhieu06-gif/chatweb.git
cd chatweb
```

### 2. Thiết lập cơ sở dữ liệu MySQL
- Tạo một database có tên `chatweb_db` (hoặc tên tùy chọn).
- Import hoặc chạy các script tạo bảng (`users`, `messages`, ...) tương ứng.

### 3. Cài đặt và khởi chạy Backend
```bash
cd backend
npm install
```
Tạo file `.env` trong thư mục `backend` và điền các thông số tương tự như sau:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chatweb_db
JWT_SECRET=your_secret_key
```
Chạy server backend:
```bash
npm start
# Hoặc chạy môi trường dev (nếu có cài nodemon)
npm run dev
```

### 4. Cài đặt và khởi chạy Frontend
Mở một terminal mới:
```bash
cd frontend
npm install
```
Chạy frontend bằng Vite:
```bash
npm run dev
```
Sau đó truy cập vào đường dẫn mà Vite cung cấp (thường là `http://localhost:5173`) trên trình duyệt để trải nghiệm.

## Tác giả
- [tranvanminhhieu06-gif](https://github.com/tranvanminhhieu06-gif)
