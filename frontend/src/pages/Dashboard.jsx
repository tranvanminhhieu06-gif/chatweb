import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { motion } from 'framer-motion';

// Kết nối tới server backend
const socket = io.connect('http://localhost:5000');

const ChatRoom = ({ currentUser, currentRoomId }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    // Tham gia phòng khi component được render
    useEffect(() => {
        const fetchOldMessages = async () => {
            try {
                // Nhớ thay đổi port nếu backend của bạn chạy port khác
                const response = await fetch(`http://localhost:5000/api/messages/${currentRoomId}`);
                const data = await response.json();
                
                if (data.success) {
                    // Map lại dữ liệu để khớp với cấu trúc hiển thị
                    const formattedMessages = data.messages.map(msg => ({
                        roomId: msg.room_id,
                        userId: msg.user_id,
                        username: msg.username,
                        content: msg.content
                    }));
                    setMessageList(formattedMessages);
                }
            } catch (error) {
                console.error("Không thể tải lịch sử tin nhắn:", error);
            }
        };

        if (currentRoomId) {
            fetchOldMessages(); // Gọi API lấy tin nhắn cũ
            socket.emit('join_room', currentRoomId); // Tham gia phòng socket
        }
    }, [currentRoomId]);

    // Lắng nghe tin nhắn mới từ Server
    useEffect(() => {
        const handleReceiveMsg = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on('receive_message', handleReceiveMsg);

        // Dọn dẹp sự kiện khi unmount để tránh bị lặp tin nhắn
        return () => {
            socket.off('receive_message', handleReceiveMsg);
        };
    }, []);

    // Hàm gửi tin nhắn
    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                roomId: currentRoomId,
                userId: currentUser.id,
                username: currentUser.username,
                content: currentMessage,
            };

            await socket.emit('send_message', messageData);
            setCurrentMessage(''); // Xóa ô input sau khi gửi
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
            {/* Khu vực hiển thị tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto bg-yellow-50">
                {messageList.map((msg, index) => {
                    const isMe = msg.userId === currentUser.id;
                    return (
                        <motion.div
                            key={index}
                            // Hiệu ứng tin nhắn nhảy lên mượt mà
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] p-3 rounded-2xl border-2 border-black ${isMe ? 'bg-purple-400 text-white rounded-br-none' : 'bg-white text-black rounded-bl-none'}`}>
                                {!isMe && <p className="text-xs font-bold mb-1 text-gray-800">{msg.username}</p>}
                                <p className="font-medium">{msg.content}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Khu vực nhập tin nhắn */}
            <div className="p-4 bg-white border-t-4 border-black flex gap-2">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => { e.key === 'Enter' && sendMessage() }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border-2 border-black rounded-lg p-2 outline-none focus:bg-blue-50 transition-colors"
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="bg-green-400 border-2 border-black px-6 font-bold rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                >
                    GỬI
                </motion.button>
            </div>
        </div>
    );
};

export default ChatRoom;