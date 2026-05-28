import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginSuccessBanner from '../components/LoginSuccessBanner';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUsername = localStorage.getItem('saved_username');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (rememberMe) {
                    localStorage.setItem('saved_username', username);
                } else {
                    localStorage.removeItem('saved_username');
                }
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                
                // 🔥 KÍCH HOẠT HIỆU ỨNG GAME BANNER
                setLoggedInUser(data.user);
                setShowSuccess(true);
            } else {
                setError(data.message || 'Tài khoản hoặc mật khẩu không đúng!');
            }
        } catch (err) {
            console.error(err);
            setError('Không thể kết nối đến server!');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="min-h-screen flex items-center justify-center p-4 font-sans relative z-10"
        >
            <motion.div 
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                className="bg-white border-4 border-black p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full relative"
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-6 -right-6 w-12 h-12 bg-[#FFD1C7] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                >
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                </motion.div>

                <h1 className="text-4xl font-black text-center mb-8 tracking-tighter uppercase">
                    Đăng Nhập
                </h1>
                
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.9 }}
                            className="mb-6 p-3 bg-[#FFD1C7] border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <motion.div whileTap={{ scale: 0.98 }}>
                        <label className="block font-black mb-2 uppercase text-sm">Tài Khoản</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-4 border-4 border-black font-bold text-lg focus:outline-none focus:bg-[#f9f9f9] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] rounded-lg"
                            placeholder="Nhập tên đăng nhập..."
                            required
                        />
                    </motion.div>
                    
                    <motion.div whileTap={{ scale: 0.98 }} className="relative">
                        <label className="block font-black mb-2 uppercase text-sm">Mật Khẩu</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 pr-16 border-4 border-black font-bold text-lg focus:outline-none focus:bg-[#f9f9f9] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] rounded-lg"
                                placeholder="Nhập mật khẩu..."
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 font-bold uppercase text-xs border-2 border-black bg-white px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD1C7] transition-colors rounded-md active:translate-y-[1px] active:translate-x-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            >
                                {showPassword ? 'Ẩn' : 'Hiện'}
                            </button>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-2 mt-1">
                        <input 
                            type="checkbox" 
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-5 h-5 border-4 border-black accent-[#FFD1C7] cursor-pointer rounded-sm"
                        />
                        <label htmlFor="rememberMe" className="font-bold cursor-pointer select-none">
                            Ghi nhớ tài khoản
                        </label>
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.03, rotate: -1 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-[#FFD1C7] font-black text-xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] transition-all mt-2 uppercase tracking-widest rounded-lg"
                    >
                        VÀO CHAT
                    </motion.button>
                </form>
                
                <div className="mt-8 pt-6 border-t-4 border-black text-center font-bold text-base">
                    <p>Chưa có tài khoản?</p>
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/register')}
                        className="mt-2 bg-white border-4 border-black px-6 py-2 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD1C7] transition-colors rounded-lg"
                    >
                        Đăng ký ngay
                    </motion.button>
                </div>
            </motion.div>

            {/* 🔥 CHÈN BANNER ĐẰNG SAU FORM ĐỂ KHI CẦN SẼ PHỦ LÊN MÀN HÌNH */}
            {showSuccess && (
                <LoginSuccessBanner 
                    username={loggedInUser.username} 
                    onComplete={() => {
                        setUser(loggedInUser);
                        navigate('/');
                    }} 
                />
            )}
        </motion.div>
    );
};

export default Login;
