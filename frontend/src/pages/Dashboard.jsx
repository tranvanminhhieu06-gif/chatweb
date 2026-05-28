import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { motion } from 'framer-motion';

const socket = io.connect('http://localhost:3000');

const ChatRoom = ({ currentUser, currentRoomId }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchOldMessages = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/messages/${currentRoomId}`);
                const data = await response.json();

                if (data.success) {
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
            fetchOldMessages();
            socket.emit('join_room', currentRoomId);
        }
    }, [currentRoomId]);

    useEffect(() => {
        const handleReceiveMsg = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on('receive_message', handleReceiveMsg);

        return () => {
            socket.off('receive_message', handleReceiveMsg);
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    const sendMessage = async () => {
        if (currentMessage.trim() !== '') {
            const messageData = {
                roomId: currentRoomId,
                userId: currentUser.id,
                username: currentUser.username,
                content: currentMessage,
            };

            await socket.emit('send_message', messageData);
            setCurrentMessage('');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col h-[80vh] w-full max-w-4xl mx-auto bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative z-10"
        >
            {/* Header */}
            <div className="bg-[#f9cbb8] border-b-4 border-black p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-white border-2 border-black rounded-full animate-pulse"></div>
                    <h2 className="text-2xl font-black uppercase tracking-wider">
                        Phòng: {currentRoomId}
                    </h2>
                </div>
                <div className="font-bold bg-white border-2 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    @{currentUser.username}
                </div>
            </div>

            {/* Khu vực hiển thị tin nhắn */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#f8f8f8]" style={{
                backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}>
                {messageList.map((msg, index) => {
                    const isMe = msg.userId === currentUser.id;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`flex mb-6 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${isMe ? 'bg-[#fcdbbd] rounded-l-2xl rounded-tr-2xl' : 'bg-white rounded-r-2xl rounded-tl-2xl'}`}>
                                {!isMe && <p className="text-sm font-black mb-1 uppercase tracking-wider">{msg.username}</p>}
                                <p className="font-bold text-lg">{msg.content}</p>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Khu vực nhập tin nhắn */}
            <div className="p-6 bg-white border-t-4 border-black flex gap-4">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => { e.key === 'Enter' && sendMessage() }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border-4 border-black font-bold text-lg p-4 focus:outline-none focus:bg-[#fce4d6] transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[4px] focus:translate-x-[4px]"
                />
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="bg-black text-white px-8 font-black text-xl border-4 border-black shadow-[6px_6px_0px_0px_#f9cbb8] hover:shadow-[2px_2px_0px_0px_#f9cbb8] hover:translate-y-[4px] hover:translate-x-[4px] transition-all uppercase"
                >
                    Gửi
                </motion.button>
            </div>
        </motion.div>
    );
};

// Wrapper để căn giữa và tạo layout
const Dashboard = ({ currentUser, currentRoomId }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
        >
            <ChatRoom currentUser={currentUser} currentRoomId={currentRoomId} />
        </motion.div>
    );
};

export default Dashboard;