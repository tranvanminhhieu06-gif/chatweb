import React from 'react';
import { motion } from 'framer-motion';

const MemphisBg = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ background: 'linear-gradient(to bottom, #ffffff, #e6e6e6)' }}>
      
      {/* Circle 1 */}
      <motion.div
        className="absolute top-10 left-32 w-24 h-24 rounded-full border-4 border-black"
        style={{ backgroundColor: '#ffe4e1' }}
        animate={{ y: [0, -20, 0], rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Concentric Circles */}
      <motion.div
        className="absolute top-40 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="black" strokeWidth="4" />
          <circle cx="60" cy="60" r="35" fill="none" stroke="black" strokeWidth="4" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="black" strokeWidth="4" />
          <circle cx="60" cy="60" r="5" fill="black" />
        </svg>
      </motion.div>

      {/* 3D Cube */}
      <motion.div
        className="absolute top-24 right-20"
        animate={{ y: [0, -25, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="#fcdbbd" stroke="black" strokeWidth="4" />
          <polyline points="10,30 50,50 90,30" fill="none" stroke="black" strokeWidth="4" />
          <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="4" />
        </svg>
      </motion.div>

      {/* Zigzag lines */}
      <motion.div
        className="absolute bottom-32 left-10"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="120" height="40" viewBox="0 0 120 40">
          <polyline points="0,20 20,0 40,20 60,0 80,20 100,0 120,20" fill="none" stroke="black" strokeWidth="4" />
          <polyline points="0,40 20,20 40,40 60,20 80,40 100,20 120,40" fill="none" stroke="black" strokeWidth="4" />
        </svg>
      </motion.div>

      {/* Cross Shape */}
      <motion.div
        className="absolute bottom-20 left-1/3"
        animate={{ rotate: [-10, 10, -10], y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M35,10 L65,10 L65,35 L90,35 L90,65 L65,65 L65,90 L35,90 L35,65 L10,65 L10,35 L35,35 Z" fill="#e0e0e0" stroke="black" strokeWidth="4" />
          {/* Dots on cross */}
          <circle cx="20" cy="50" r="2" fill="black" />
          <circle cx="50" cy="20" r="2" fill="black" />
          <circle cx="80" cy="50" r="2" fill="black" />
          <circle cx="50" cy="80" r="2" fill="black" />
          <circle cx="50" cy="50" r="2" fill="black" />
        </svg>
      </motion.div>

      {/* Large Peach Rectangle */}
      <motion.div
        className="absolute top-1/4 left-10 w-40 h-40 bg-[#f9cbb8]"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Wavy Cylinder */}
      <motion.div
        className="absolute bottom-10 right-32"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="200" height="60" viewBox="0 0 200 60">
          <path d="M10,20 Q30,0 50,20 T90,20 T130,20 T170,20" fill="none" stroke="black" strokeWidth="4" />
          <path d="M10,40 Q30,20 50,40 T90,40 T130,40 T170,40" fill="none" stroke="black" strokeWidth="4" />
          <ellipse cx="10" cy="30" rx="4" ry="10" fill="none" stroke="black" strokeWidth="4" />
          <ellipse cx="170" cy="30" rx="4" ry="10" fill="none" stroke="black" strokeWidth="4" />
        </svg>
      </motion.div>

      {/* Triangle Prism */}
      <motion.div
        className="absolute top-1/3 right-1/4"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <polygon points="10,90 50,10 90,90" fill="#fce4d6" stroke="black" strokeWidth="4" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="black" strokeWidth="4" />
          <line x1="10" y1="90" x2="90" y2="90" stroke="black" strokeWidth="4" />
          {/* Hatched lines */}
          <line x1="60" y1="30" x2="80" y2="70" stroke="black" strokeWidth="2" />
          <line x1="55" y1="50" x2="70" y2="80" stroke="black" strokeWidth="2" />
        </svg>
      </motion.div>
      
      {/* Background Dots Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(black 2px, transparent 2px)',
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0'
      }}></div>
    </div>
  );
};

export default MemphisBg;
