require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
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
// API LẤY LỊCH SỬ TIN NHẮN THEO PHÒNG (GET: http://localhost:3000/api/messages/:roomId)
// ==========================================
app.get('/api/messages/:roomId', async (req, res) => {
    const { roomId } = req.params;

    try {
        // Câu lệnh SQL "thần thánh" kết hợp 2 bảng để lấy tin nhắn kèm tên người gửi
        const [rows] = await db.query(`
            SELECT 
                m.id, 
                m.room_id, 
                m.user_id, 
                m.content, 
                m.created_at, 
                u.username 
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.room_id = ?
            ORDER BY m.created_at ASC
        `, [roomId]);

        // Trả danh sách tin nhắn cũ về cho Frontend
        return res.json({ success: true, messages: rows });

    } catch (error) {
        console.error('Lỗi lấy lịch sử tin nhắn:', error);
        return res.status(500).json({ success: false, message: 'Không thể tải lịch sử đoạn chat' });
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
        try {
            // 1. Lưu thẳng vào MySQL (Cột PASSWORD viết hoa nếu có liên quan, các cột khác viết thường)
            const [result] = await db.query(
                'INSERT INTO messages (room_id, user_id, content) VALUES (?, ?, ?)',
                [data.room_id, data.user_id, data.content]
            );

            // 2. Đóng gói dữ liệu CHUẨN ĐÃ CÓ ID TỪ DATABASE để gửi cho người khác
            const fullMessageData = {
                id: result.insertId, // ID xịn từ MySQL sinh ra
                room_id: data.room_id,
                user_id: data.user_id,
                username: data.username,
                content: data.content,
                created_at: new Date() // Gắn tạm thời gian hiện tại, hoặc lấy chuẩn từ DB
            };

            // 3. Phát sóng cho tất cả mọi người trong phòng TRỪ người gửi
            socket.broadcast.to(data.room_id).emit('receive_message', fullMessageData);

        } catch (error) {
            console.error('Lỗi lưu hoặc truyền tin nhắn:', error);
            // Có thể emit một sự kiện lỗi ngược về cho chính người gửi nếu muốn
            socket.emit('message_error', { content: data.content, message: 'Không thể gửi tin nhắn' });
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