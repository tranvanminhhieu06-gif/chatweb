import React, { useEffect, useState } from 'react';

const LoginSuccessBanner = ({ username, onComplete }) => {
  // Các bước chuyển động (Timeline)
  const [showOverlay, setShowOverlay] = useState(false);
  const [stretchBanner, setStretchBanner] = useState(false);
  const [revealText, setRevealText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Bước 1: Phủ lớp màn mờ tối nền sau 50ms
    const t1 = setTimeout(() => setShowOverlay(true), 50);

    // Bước 2: Banner bắt đầu quét/giãn thẳng ra theo chiều ngang từ tâm (sau 300ms)
    const t2 = setTimeout(() => setStretchBanner(true), 300);

    // Bước 3: Banner giãn xong, chữ "LOGIN SUCCESSFUL" và Username hiện ra với hiệu ứng loang/trượt (sau 800ms)
    const t3 = setTimeout(() => setRevealText(true), 800);

    // Bước 4: Giữ nguyên hiệu ứng trong 2.5 giây rồi bắt đầu làm mờ dần toàn bộ (Fade out)
    const t4 = setTimeout(() => setFadeOut(true), 3300);

    // Bước 5: Kết thúc hoàn toàn và chuyển trang (sau khi fade out xong)
    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3800);

    return () => {
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <>
      {/* 💥 SECRET WEAPON: SVG Filter tạo hiệu ứng viền rách/vệt cọ nham nhở tự nhiên như video */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="cinematic-torn-edge">
            {/* Tạo ra nhiễu hạt fractal tự nhiên */}
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            {/* Dùng nhiễu hạt để làm lệch/méo các đường biên của SourceGraphic */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* 1. LỚP NỀN OVERLAY: Mờ tối, đậm chất điện ảnh */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity duration-500
          ${showOverlay ? 'opacity-100' : 'opacity-0'}
          ${fadeOut ? 'opacity-0' : ''}`}
      >
        {/* 2. BANNER CHÍNH: Màu tối, áp filter viền rách, hiệu ứng giãn ngang (scale-x) */}
        <div
          className={`relative bg-[#161616] text-center max-w-xl w-full py-10 px-6 transform transition-all cubic-bezier(0.25, 1, 0.5, 1)
            ${stretchBanner ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            ${stretchBanner ? 'duration-700' : 'duration-0'}`}
          style={{
            filter: 'url(#cinematic-torn-edge)', // Kích hoạt viền rách xịn
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0,0,0,0.6)'
          }}
        >
          {/* Họa tiết tia sáng quét tinh tế bên trong banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />

          {/* 3. TIÊU ĐỀ TRÊN: Hiện ra kết hợp giãn khoảng cách chữ (Letter-spacing tracking) */}
          <h2
            className={`text-[#e63946] font-extrabold text-2xl uppercase tracking-[0.3em] font-['Space_Grotesk'] transition-all duration-1000 transform
              ${revealText ? 'opacity-100 translate-y-0 filter blur-0 scale-100' : 'opacity-0 -translate-y-2 filter blur-sm scale-95'}`}
            style={{ textShadow: '0 0 10px rgba(230, 57, 70, 0.4)' }}
          >
            LOGIN SUCCESSFUL
          </h2>

          {/* Đường gạch ngang mảnh đậm nét cinematic ngăn cách */}
          <div
            className={`h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-4 mx-auto transition-all duration-700 w-3/4
              ${revealText ? 'scale-x-100' : 'scale-x-0'}`}
          />

          {/* 4. TÊN USERNAME: Hiện muộn hơn một chút, trượt nhẹ từ dưới lên, KHÔNG CÓ AVATAR */}
          <div
            className={`transition-all duration-1000 delay-200 transform
              ${revealText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <p className="text-gray-500 text-xs font-semibold tracking-[0.4em] uppercase mb-1">
              Welcome Back Captain
            </p>
            <h1 className="text-white font-black text-4xl md:text-5xl tracking-wide font-['Space_Grotesk'] drop-shadow-lg">
              {username}
            </h1>
          </div>
        </div>
      </div>

      {/* Inject animation keyframe tùy biến cho hiệu ứng vệt sáng chạy qua banner */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default LoginSuccessBanner;