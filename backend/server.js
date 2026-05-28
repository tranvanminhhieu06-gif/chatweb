const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const db = require('./models/db');

// Khởi tạo các Route
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);

// Cấu hình Socket.io cơ bản kết nối với Frontend
const io = new Server(server, {
    cors: {
        origin: "*", // Cho phép mọi domain kết nối tới Socket
        methods: ["GET", "POST"]
    }
});

// Middleware xử lý dữ liệu hệ thống
app.use(cors({ origin: "*" }));
app.use(express.json()); // Đọc body dạng JSON gửi lên từ client

// Áp dụng định tuyến cho phân hệ Auth
app.use('/api/auth', authRoutes);

// Route kiểm tra trạng thái hoạt động của server
app.get('/', (req, res) => {
    res.send('Server ChatWeb đang hoạt động tốt!');
});

// ==========================================
// API LẤY LỊCH SỬ TIN NHẮN THEO PHÒNG
// ==========================================
app.get('/api/messages/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
        // Lấy tin nhắn cùng với tên người gửi thông qua JOIN bảng users
        const [messages] = await db.query(`
            SELECT m.*, u.username 
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.room_id = ?
            ORDER BY m.created_at ASC
        `, [roomId]);

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Lỗi lấy tin nhắn:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// ==========================================
// CẤU HÌNH SOCKET.IO CHO TIN NHẮN REALTIME
// ==========================================
io.on('connection', (socket) => {
    console.log(`⚡ Một thiết bị vừa kết nối: ${socket.id}`);

    // 1. Người dùng tham gia vào một phòng cụ thể
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} đã tham gia phòng: ${roomId}`);
    });

    // 2. Xử lý khi người dùng gửi tin nhắn
    socket.on('send_message', async (data) => {
        // data mong đợi: { roomId, userId, username, content }
        try {
            // Lưu tin nhắn vào MySQL để giữ lịch sử
            await db.query(
                'INSERT INTO messages (room_id, user_id, content) VALUES (?, ?, ?)',
                [data.roomId, data.userId, data.content]
            );

            // Gửi tin nhắn đến TẤT CẢ mọi người trong phòng (bao gồm cả người gửi để hiển thị mượt mà)
            // Kèm theo thời gian thực để Frontend hiển thị
            const messageData = {
                ...data,
                created_at: new Date().toISOString()
            };

            io.to(data.roomId).emit('receive_message', messageData);
        } catch (error) {
            console.error('Lỗi khi lưu tin nhắn:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ Thiết bị ngắt kết nối: ${socket.id}`);
    });
});

// Chạy server trên port chỉ định
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server đang vận hành mượt mà tại port http://localhost:${PORT}`);
});