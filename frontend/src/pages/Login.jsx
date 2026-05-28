import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Login = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (isLogin) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);
                    setUser(data.user);
                } else {
                    setIsLogin(true);
                    setError('Đăng ký thành công! Vui lòng đăng nhập.');
                    setUsername('');
                    setPassword('');
                }
            } else {
                setError(data.message || 'Có lỗi xảy ra!');
            }
        } catch (err) {
            console.error(err);
            setError('Không thể kết nối đến server!');
        }
    };

    return (
        <motion.div 
            // Hiệu ứng khi vào trang và rời trang
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="min-h-screen flex items-center justify-center p-4 font-sans"
        >
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border-4 border-black p-8 rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full relative z-10"
            >
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#f9cbb8] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                    <div className="w-4 h-4 bg-black rounded-full animate-pulse"></div>
                </div>

                <h1 className="text-4xl font-black text-center mb-8 tracking-tighter uppercase">
                    {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                </h1>
                
                {error && (
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="mb-6 p-3 bg-[#fce4d6] border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        {error}
                    </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block font-black mb-2 uppercase text-lg">Tài Khoản</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-4 border-4 border-black font-bold text-lg focus:outline-none focus:bg-[#fce4d6] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px]"
                            placeholder="Nhập tên đăng nhập..."
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block font-black mb-2 uppercase text-lg">Mật Khẩu</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 border-4 border-black font-bold text-lg focus:outline-none focus:bg-[#fce4d6] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px]"
                            placeholder="Nhập mật khẩu..."
                            required
                        />
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-[#f9cbb8] font-black text-2xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] transition-all mt-4 uppercase tracking-widest"
                    >
                        {isLogin ? 'VÀO CHAT' : 'TẠO TÀI KHOẢN'}
                    </motion.button>
                </form>
                
                <p className="mt-8 text-center font-bold text-lg">
                    {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="bg-black text-white px-3 py-1 font-black transform -skew-x-12 hover:bg-[#f9cbb8] hover:text-black hover:border-black hover:border-2 transition-all inline-block ml-2"
                    >
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                    </button>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Login;
