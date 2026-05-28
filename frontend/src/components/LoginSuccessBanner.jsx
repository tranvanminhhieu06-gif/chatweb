import React, { useEffect, useState } from 'react';

const LoginSuccessBanner = ({ username, onComplete }) => {
  // Trạng thái vòng đời hiệu ứng: 'hidden' -> 'drop' -> 'expand' -> 'reveal' -> 'fadeout'
  const [animationState, setAnimationState] = useState('hidden');

  useEffect(() => {
    // 1. Kích hoạt quả cầu rơi từ trên xuống ngay lập tức
    setAnimationState('drop');

    // 2. Sau 600ms (khi quả cầu chạm tâm), chuyển sang hiệu ứng giãn rộng ra 2 bên
    const timerExpand = setTimeout(() => {
      setAnimationState('expand');
    }, 600);

    // 3. Sau 1100ms (khi thanh ngang giãn xong), cho nội dung bên trong hiện ra
    const timerReveal = setTimeout(() => {
      setAnimationState('reveal');
    }, 1100);

    // 4. Giữ hiển thị 2.5 giây rồi tiến hành mờ dần toàn bộ (Fade out)
    const timerFadeOut = setTimeout(() => {
      setAnimationState('fadeout');
    }, 3600);

    // 5. Kết thúc hoàn toàn và chuyển trang
    const timerComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4100);

    return () => {
      clearTimeout(timerExpand);
      clearTimeout(timerReveal);
      clearTimeout(timerFadeOut);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  if (animationState === 'hidden') return null;

  return (
    <>
      {/* Nhúng mã Keyframe CSS để tạo độ nảy mượt mà cho quả cầu rơi */}
      <style>{`
        @keyframes circleDropFromTop {
          0% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
          60% { transform: translateY(20px) scale(1.1); opacity: 1; }
          80% { transform: translateY(-10px) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-circle-drop {
          animation: circleDropFromTop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* LỚP NỀN OVERLAY TỐI MỜ CỦA GAME */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500
          ${animationState === 'fadeout' ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* BANNER CHÍNH: Thay đổi hình dạng từ hình tròn sang thanh ngang */}
        <div
          className={`bg-[#141414] border-4 border-black flex items-center justify-between px-8 shadow-[12px_12px_0px_0px_#000] transform transition-all ease-in-out
            ${animationState === 'drop' ? 'animate-circle-drop w-20 h-20 rounded-full' : ''}
            ${animationState === 'expand' || animationState === 'reveal' || animationState === 'fadeout' 
              ? 'w-full max-w-2xl h-28 rounded-2xl duration-500' : ''}`}
        >
          
          {/* NỘI DUNG CHỈ HIỂN THỊ KHI BANNER ĐÃ GIÃN XONG */}
          <div 
            className={`w-full flex items-center justify-between transition-opacity duration-300
              ${animationState === 'reveal' ? 'opacity-100' : 'opacity-0'}`}
          >
            
            {/* 👈 BÊN TRÁI: ICON HÌNH NGƯỜI */}
            <div className="flex-shrink-0 w-12 h-12 bg-[#4ecdc4] border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>

            {/* 🎯 Ở GIỮA: CHỮ LỚN LÀ TÊN TÀI KHOẢN, CHỮ NHỎ LÀ TRẠNG THÁI */}
            <div className="flex flex-col items-center justify-center text-center flex-grow mx-4">
              {/* Chữ lớn: Tên tài khoản */}
              <h1 className="text-white font-black text-3xl md:text-4xl tracking-wide uppercase font-['Space_Grotesk'] drop-shadow-[2px_2px_0px_#000]">
                {username}
              </h1>
              {/* Chữ nhỏ: Thông báo đăng nhập thành công */}
              <p className="text-[#ff6b6b] font-bold text-xs md:text-sm tracking-[0.2em] uppercase mt-1">
                ĐĂNG NHẬP THÀNH CÔNG
              </p>
            </div>

            {/* 👉 BÊN PHẢI: KHUNG ẨN ĐỐI XỨNG (ĐÃ BỎ AVATAR NHƯNG GIỮ KHUNG ĐỂ CÂN BẰNG TÂM) */}
            <div className="flex-shrink-0 w-12 h-12 invisible">
              {/* Mục này ẩn đi giúp phần chữ ở giữa luôn được neo chính xác tại tâm của banner */}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSuccessBanner;