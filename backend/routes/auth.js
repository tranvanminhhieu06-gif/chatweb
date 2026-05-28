const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Import kết nối MySQL Pool đã tạo ở bước trước

// Khóa bí mật dùng để mã hóa JWT Token (Nên để trong file .env)
const JWT_SECRET = process.env.JWT_SECRET || 'ma_bi_mat_chatweb_memphis_style';

// ==========================================
// 1. API ĐĂNG KÝ (POST: /api/auth/register)
// ==========================================
router.post('/register', async (req, res) => {
    const { username, password, avatar_url } = req.body;

    // Kiểm tra tính hợp lệ của dữ liệu đầu vào
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ tài khoản và mật khẩu' });
    }

    try {
        // Kiểm tra xem tên tài khoản đã tồn tại trong MySQL chưa
        const [existingUser] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Tài khoản này đã tồn tại trên hệ thống' });
        }

        // Tiến hành băm (hash) mật khẩu tăng tính bảo mật
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Lưu thông tin người dùng mới vào database
        await db.query(
            'INSERT INTO users (username, password, avatar_url) VALUES (?, ?, ?)',
            [username, hashedPassword, avatar_url || null]
        );

        return res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công mượt mà!'
        });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra từ phía máy chủ: ' + error.message });
    }
});

// ==========================================
// 2. API ĐĂNG NHẬP (POST: /api/auth/login)
// ==========================================
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản và mật khẩu' });
    }

    try {
        // Tìm kiếm người dùng dựa trên username
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' });
        }

        const user = users[0];

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' });
        }

        // Tạo JWT token chứa thông tin id và username để gửi về client
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1d' } // Token hết hạn sau 1 ngày
        );

        return res.json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: {
                id: user.id,
                username: user.username,
                avatar_url: user.avatar_url
            }
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra từ phía máy chủ' });
    }
});

module.exports = router;