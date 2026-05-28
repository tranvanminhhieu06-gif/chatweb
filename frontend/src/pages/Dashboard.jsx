import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

const socket = io.connect('http://localhost:3000');

// ==========================================
// COMPONENT: KHUNG CHAT (CHAT ROOM)
// ==========================================
const ChatRoom = ({ currentUser, currentRoomId, onBack }) => {
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
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative z-10 rounded-xl overflow-hidden"
        >
            <div className="bg-[#f9cbb8] border-b-4 border-black p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onBack}
                        className="bg-white border-2 border-black font-black px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md"
                    >
                        ← QUAY LẠI
                    </motion.button>
                    <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
                        <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
                        Phòng: {currentRoomId}
                    </h2>
                </div>
            </div>

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

            <div className="p-6 bg-white border-t-4 border-black flex gap-4">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => { e.key === 'Enter' && sendMessage() }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border-4 border-black font-bold text-lg p-4 focus:outline-none focus:bg-[#fce4d6] transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[4px] focus:translate-x-[4px] rounded-lg"
                />
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="bg-black text-white px-8 font-black text-xl border-4 border-black shadow-[6px_6px_0px_0px_#f9cbb8] hover:shadow-[2px_2px_0px_0px_#f9cbb8] hover:translate-y-[4px] hover:translate-x-[4px] transition-all uppercase rounded-lg"
                >
                    Gửi
                </motion.button>
            </div>
        </motion.div>
    );
};

// ==========================================
// COMPONENT: SẢNH CHỜ (LOBBY DASHBOARD)
// ==========================================
const Dashboard = ({ currentUser }) => {
    const [activeRoom, setActiveRoom] = useState(null);
    const [savedRooms, setSavedRooms] = useState([]);
    const [joinRoomId, setJoinRoomId] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const rooms = JSON.parse(localStorage.getItem('chatweb_rooms') || '[]');
        setSavedRooms(rooms);
    }, []);

    const saveRoomToLocal = (roomId) => {
        const rooms = JSON.parse(localStorage.getItem('chatweb_rooms') || '[]');
        if (!rooms.includes(roomId)) {
            const updatedRooms = [roomId, ...rooms];
            localStorage.setItem('chatweb_rooms', JSON.stringify(updatedRooms));
            setSavedRooms(updatedRooms);
        }
    };

    const handleJoinRoom = (e) => {
        e?.preventDefault();
        if (joinRoomId.trim()) {
            saveRoomToLocal(joinRoomId.trim());
            setActiveRoom(joinRoomId.trim());
        }
    };

    const handleCreateRandomRoom = () => {
        const randomId = 'ROOM_' + Math.random().toString(36).substring(2, 8).toUpperCase();
        saveRoomToLocal(randomId);
        setActiveRoom(randomId);
    };

    return (
        <div className="min-h-screen flex flex-col p-6 font-sans relative z-10">
            {/* TOP HEADER MENU */}
            <div className="w-full flex justify-end mb-8 relative">
                <motion.button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3 rounded-full flex items-center justify-center cursor-pointer relative z-50"
                >
                    {/* SVG Hamburger Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </motion.button>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute top-16 right-0 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl min-w-[250px] z-40 flex flex-col items-center gap-4"
                        >
                            <div className="w-20 h-20 bg-[#FFD1C7] border-4 border-black rounded-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                                <span className="text-3xl font-black uppercase">{currentUser.username.charAt(0)}</span>
                            </div>
                            <h3 className="font-black text-xl text-center uppercase tracking-wider">{currentUser.username}</h3>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.reload();
                                }}
                                className="w-full mt-2 bg-red-400 border-4 border-black font-bold py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
                            >
                                Đăng xuất
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                {activeRoom ? (
                    <ChatRoom 
                        key="chatroom"
                        currentUser={currentUser} 
                        currentRoomId={activeRoom} 
                        onBack={() => setActiveRoom(null)}
                    />
                ) : (
                    <motion.div 
                        key="lobby"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="flex-1 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full"
                    >
                        {/* BẢNG NHỎ: QUẢN LÝ TẠO/THAM GIA PHÒNG */}
                        <div className="md:w-1/3 flex flex-col gap-6">
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="bg-[#fce4d6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 rounded-xl flex flex-col items-center justify-center gap-4 text-center"
                            >
                                <div className="w-16 h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-2">
                                    <span className="text-3xl font-black">+</span>
                                </div>
                                <h3 className="font-black text-2xl uppercase tracking-tighter">Phòng Mới</h3>
                                <p className="font-bold text-sm mb-2">Tạo một phòng ngẫu nhiên và mời bạn bè vào chung vui ngay.</p>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleCreateRandomRoom}
                                    className="w-full bg-black text-white font-black py-3 border-4 border-black shadow-[4px_4px_0px_0px_#f9cbb8] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#f9cbb8] transition-all uppercase"
                                >
                                    TẠO PHÒNG
                                </motion.button>
                            </motion.div>

                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="bg-[#FFD1C7] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 rounded-xl flex flex-col items-center justify-center gap-4 text-center"
                            >
                                <h3 className="font-black text-2xl uppercase tracking-tighter">Tham Gia Phòng</h3>
                                <form onSubmit={handleJoinRoom} className="w-full flex flex-col gap-3">
                                    <input
                                        type="text"
                                        placeholder="Nhập ID phòng..."
                                        value={joinRoomId}
                                        onChange={(e) => setJoinRoomId(e.target.value)}
                                        className="w-full p-3 border-4 border-black font-bold text-center focus:outline-none focus:bg-white transition-colors rounded-lg"
                                        required
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        type="submit"
                                        className="w-full bg-white font-black py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
                                    >
                                        THAM GIA
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>

                        {/* BẢNG LỚN: DANH SÁCH PHÒNG */}
                        <motion.div 
                            className="md:w-2/3 bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col overflow-hidden"
                        >
                            <div className="bg-black text-white p-5 border-b-4 border-black">
                                <h2 className="font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-4 h-4 bg-[#FFD1C7] border-2 border-white rounded-full animate-pulse"></div>
                                    Phòng Của Bạn
                                </h2>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto bg-[#f9f9f9]">
                                {savedRooms.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                        <p className="font-black text-xl uppercase text-center">Chưa có phòng nào<br/>Hãy tạo hoặc tham gia!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {savedRooms.map((roomId, idx) => (
                                            <motion.div
                                                key={roomId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                onClick={() => {
                                                    setJoinRoomId(roomId);
                                                    setActiveRoom(roomId);
                                                }}
                                                className="bg-white border-4 border-black p-5 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] hover:bg-[#fce4d6] transition-all cursor-pointer flex justify-between items-center group"
                                            >
                                                <h4 className="font-black text-lg uppercase tracking-wider group-hover:text-black">
                                                    ID: {roomId}
                                                </h4>
                                                <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold bg-white group-hover:bg-black group-hover:text-white transition-colors">
                                                    →
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;