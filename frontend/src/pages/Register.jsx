import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Bước 1: Gọi API Đăng ký
            const registerRes = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const registerData = await registerRes.json();
            
            if (registerData.success) {
                // Bước 2: Tự động Đăng nhập ngay sau khi đăng ký thành công
                const loginRes = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const loginData = await loginRes.json();
                
                if (loginData.success) {
                    localStorage.setItem('user', JSON.stringify(loginData.user));
                    localStorage.setItem('token', loginData.token);
                    setUser(loginData.user);
                    navigate('/'); // Chuyển thẳng vào Sảnh chờ
                } else {
                    setError('Đăng ký thành công nhưng tự động đăng nhập thất bại.');
                }
            } else {
                setError(registerData.message || 'Đăng ký thất bại!');
            }
        } catch (err) {
            console.error(err);
            setError('Không thể kết nối đến server!');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="min-h-screen flex items-center justify-center p-4 font-sans relative z-10"
        >
            <motion.div 
                initial={{ opacity: 0, y: 50, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                className="bg-white border-4 border-black p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full relative"
            >
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-6 -left-6 w-12 h-12 bg-[#fcdbbd] border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                >
                    <div className="w-4 h-4 bg-black rotate-45"></div>
                </motion.div>

                <h1 className="text-4xl font-black text-center mb-8 tracking-tighter uppercase">
                    Đăng Ký
                </h1>
                
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.9 }}
                            className="mb-6 p-3 bg-[#FFD1C7] border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <motion.div whileTap={{ scale: 0.98 }}>
                        <label className="block font-black mb-2 uppercase text-sm">Tài Khoản Mới</label>
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
                    
                    <motion.button 
                        whileHover={{ scale: 1.03, rotate: 1 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-[#fce4d6] font-black text-xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] transition-all mt-2 uppercase tracking-widest rounded-lg"
                    >
                        HOÀN TẤT ĐĂNG KÝ
                    </motion.button>
                </form>
                
                <div className="mt-8 pt-6 border-t-4 border-black text-center font-bold text-base">
                    <p>Đã có tài khoản?</p>
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/login')}
                        className="mt-2 bg-white border-4 border-black px-6 py-2 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors rounded-lg"
                    >
                        Quay lại Đăng nhập
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Register;
