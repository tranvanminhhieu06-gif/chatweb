import React, { useEffect, useState } from 'react';

const LoginSuccessBanner = ({ username, onComplete }) => {
  // Trạng thái vòng đời timeline: 'hidden' -> 'drop' -> 'expand' -> 'reveal' -> 'collapse' -> 'flyup'
  const [stage, setStage] = useState('hidden');

  useEffect(() => {
    // 1. Quả cầu xuất hiện và rơi từ trên xuống
    setStage('drop');

    // 2. Chạm tâm sau 600ms -> Ngay lập tức co giãn thành thanh ngang dài
    const timerExpand = setTimeout(() => setStage('expand'), 600);

    // 3. Thanh ngang giãn xong sau 1100ms -> Hiện chữ và toàn bộ icon/avatar
    const timerReveal = setTimeout(() => setStage('reveal'), 1100);

    // 4. Giữ hiển thị nội dung trong 2.5 giây, sau đó gộp lại thành hình tròn (Collapse) tại mốc 3600ms
    const timerCollapse = setTimeout(() => setStage('collapse'), 3600);

    // 5. Gộp xong thành hình tròn sau 4100ms -> Bắn vút thẳng lên trời (Fly up)
    const timerFlyUp = setTimeout(() => setStage('flyup'), 4100);

    // 6. Biến mất hoàn toàn khỏi màn hình và kích hoạt chuyển trang (onComplete) tại mốc 4700ms
    const timerComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4700);

    return () => {
      [timerExpand, timerReveal, timerCollapse, timerFlyUp, timerComplete].forEach(clearTimeout);
    };
  }, [onComplete]);

  if (stage === 'hidden') return null;

  return (
    <>
      {/* ⚙️ ENGINE KEYFRAMES: Xử lý tăng tốc phần cứng giúp hiệu ứng mượt tuyệt đối */}
      <style>{`
        @keyframes sphereDrop {
          0% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
          60% { transform: translateY(15px) scale(1.05); opacity: 1; }
          80% { transform: translateY(-8px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes sphereFlyUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          30% { transform: translateY(20px) scale(1.05); }
          100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
        }
        @keyframes shockwaveLoang {
          0% { transform: scale(0); opacity: 1; border-width: 6px; }
          100% { transform: scale(3.5); opacity: 0; border-width: 1px; }
        }
        .animate-drop { animation: sphereDrop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards; }
        .animate-flyup { animation: sphereFlyUp 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards; }
        .animate-shockwave { animation: shockwaveLoang 0.5s ease-out forwards; }
      `}</style>

      {/* LỚP NỀN OVERLAY TỐI ĐIỆN ẢNH */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm transition-opacity duration-500">
        
        {/* HIỆU ỨNG SÓNG XUNG KÍCH KHI VA CHẠM (SHOCKWAVE) */}
        {stage === 'expand' && (
          <div className="absolute w-44 h-44 border-2 border-[#ff6b6b] rounded-full animate-shockwave pointer-events-none" />
        )}

        {/* ========================================================================= */}
        {/* BANNER ĐA TRẠNG THÁI (MORPHING BANNER CONTAINER)                          */}
        {/* ========================================================================= */}
        <div
          className={`bg-[#141414] border-4 border-black flex items-center justify-between shadow-[12px_12px_0px_0px_#000] transform transition-all duration-500 ease-in-out
            ${stage === 'drop' ? 'animate-drop w-20 h-20 rounded-full px-0' : ''}
            
            ${stage === 'expand' ? 'w-full max-w-2xl h-28 rounded-2xl px-8' : ''}
            ${stage === 'reveal' ? 'w-full max-w-2xl h-28 rounded-2xl px-8' : ''}
            
            ${stage === 'collapse' ? 'w-20 h-20 rounded-full px-0' : ''}
            ${stage === 'flyup' ? 'animate-flyup w-20 h-20 rounded-full px-0' : ''}`}
        >
          
          {/* KHUNG NỘI DUNG BÊN TRONG: Chỉ mở hiển thị khi ở trạng thái 'reveal' */}
          <div 
            className={`w-full flex items-center justify-between transition-all duration-300 transform
              ${stage === 'reveal' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}
          >
            
            {/* 👈 BÊN TRÁI: ICON HÌNH NGƯỜI */}
            <div className="flex-shrink-0 w-12 h-12 bg-[#4ecdc4] border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>

            {/* 🎯 Ở GIỮA: CHỮ LỚN TÊN TÀI KHOẢN & CHỮ NHỎ "Free Access" */}
            <div className="flex flex-col items-center justify-center text-center flex-grow mx-4">
              {/* Chữ lớn tên tài khoản */}
              <h1 className="text-white font-black text-3xl md:text-4xl tracking-wider uppercase font-['Space_Grotesk'] drop-shadow-[2.5px_2.5px_0px_#000]">
                {username}
              </h1>
              {/* Chữ nhỏ trạng thái quyền truy cập */}
              <p className="text-[#ff6b6b] font-extrabold text-xs md:text-sm tracking-[0.25em] uppercase mt-1">
                Free Access
              </p>
            </div>

            {/* 👉 BÊN PHẢI: AVATAR ĐỐI XỨNG CÂN BẰNG GIAO DIỆN */}
            <div className="flex-shrink-0 w-12 h-12 bg-[#ffb8b8] border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_#000] flex items-center justify-center">
              {/* Bạn có thể thay thẻ ẩn này bằng một hình ảnh avatar thật <img src={...} /> */}
              <div className="w-8 h-8 rounded-full bg-black/10 border border-black/20" />
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default LoginSuccessBanner;