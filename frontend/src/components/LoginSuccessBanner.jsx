import React, { useEffect, useState } from 'react';

const LoginSuccessBanner = ({ username, onComplete }) => {
  // stage: 0 (ẩn), 1 (banner phóng to ra), 2 (tên trượt lên), 3 (mờ dần và biến mất)
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Giai đoạn 1: Banner xuất hiện ngay lập tức với hiệu ứng phóng to nảy nhẹ
    setStage(1);

    // Giai đoạn 2: Sau 400ms, cho tên người dùng trượt lên mượt mà
    const timer1 = setTimeout(() => setStage(2), 400);

    // Giai đoạn 3: Sau 2.5 giây, làm mờ toàn bộ và kích hoạt chuyển trang
    const timer2 = setTimeout(() => {
      setStage(3);
      // Đợi hiệu ứng fade-out (500ms) chạy xong thì gọi hàm chuyển hướng
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (stage === 0) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500 
        ${stage === 3 ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* BANNER CHÍNH: Màu tối, bóng cứng Memphis, viền rách kiểu torn-paper */}
      <div
        className={`relative bg-[#121212] border-4 border-black px-16 py-8 text-center max-w-lg w-full transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${stage === 1 ? 'scale-50 opacity-0 -rotate-3' : ''}
          ${stage >= 2 ? 'scale-100 opacity-100 rotate-0 shadow-[12px_12px_0px_0px_#000]' : ''}`}
        style={{
          // Tạo hiệu ứng cạnh rách nhẹ tự nhiên của giấy bằng clip-path
          clipPath: 'polygon(1% 2%, 99% 1%, 100% 38%, 99% 97%, 96% 99%, 2% 98%, 0% 63%, 1% 4%)'
        }}
      >
        {/* Hiệu ứng tia sáng quét ngang (Shine effect) tăng tính cinematic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-1/2 h-full bg-white/5 absolute -skew-x-12 translate-x-[-150%] animate-[pulse_2s_infinite]" />
        </div>

        {/* 1. TIÊU ĐỀ CHÍNH (Soul Huntress Style) */}
        <h2 className="text-[#ff6b6b] font-black tracking-[0.25em] text-2xl uppercase font-['Space_Grotesk'] drop-shadow-[2px_2px_0px_#000]">
          LOGIN SUCCESSFUL
        </h2>

        {/* 2. PHẦN TÊN USERNAME: Trượt lên mượt mà sau khi banner mở */}
        <div 
          className={`mt-4 border-t-2 border-dashed border-white/10 pt-3 transition-all duration-700 transform
            ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="text-gray-400 text-xs font-medium tracking-widest uppercase">Welcome back</p>
          
          {/* Tên người dùng hiển thị to, rõ nét, không có avatar bọc quanh */}
          <h1 className="text-[#4ecdc4] font-black text-3xl md:text-4xl mt-1 tracking-wide drop-shadow-[3px_3px_0px_#000]">
            {username}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccessBanner;
