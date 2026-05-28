import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExplodingShape = ({ children, className, initialProps, animateProps, transitionProps }) => {
    const [exploded, setExploded] = useState(false);
    
    // Tạo 12 mảnh pháo hoa
    const particles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        angle: (i * 30) * (Math.PI / 180),
        color: ['#FFD1C7', '#fce4d6', '#fcdbbd', '#000000'][i % 4]
    }));

    if (exploded) {
        return (
            <div className={`absolute ${className.split(' ').filter(c => c.startsWith('top') || c.startsWith('bottom') || c.startsWith('left') || c.startsWith('right')).join(' ')}`}>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        animate={{ 
                            opacity: 0, 
                            scale: 0,
                            x: Math.cos(p.angle) * 100,
                            y: Math.sin(p.angle) * 100 
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute w-3 h-3 rounded-full border-2 border-black"
                        style={{ backgroundColor: p.color }}
                    />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            className={`absolute cursor-pointer pointer-events-auto ${className}`}
            initial={initialProps}
            animate={animateProps}
            transition={transitionProps}
            onClick={() => setExploded(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {children}
        </motion.div>
    );
};

const MemphisBg = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ background: 'linear-gradient(to bottom, #ffffff, #f0f0f0)' }}>
            {/* Background Dots Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(black 2px, transparent 2px)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0'
            }}></div>

            {/* Circle 1 */}
            <ExplodingShape
                className="top-10 left-32"
                animateProps={{ y: [0, -20, 0], rotate: 360 }}
                transitionProps={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
                <div className="w-24 h-24 rounded-full border-4 border-black" style={{ backgroundColor: '#ffe4e1' }} />
            </ExplodingShape>

            {/* Concentric Circles */}
            <ExplodingShape
                className="top-40 left-1/2 -translate-x-1/2"
                animateProps={{ y: [0, 15, 0] }}
                transitionProps={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="black" strokeWidth="4" />
                    <circle cx="60" cy="60" r="35" fill="none" stroke="black" strokeWidth="4" />
                    <circle cx="60" cy="60" r="20" fill="none" stroke="black" strokeWidth="4" />
                    <circle cx="60" cy="60" r="5" fill="black" />
                </svg>
            </ExplodingShape>

            {/* 3D Cube */}
            <ExplodingShape
                className="top-24 right-20"
                animateProps={{ y: [0, -25, 0], rotate: [0, 10, 0] }}
                transitionProps={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="#FFD1C7" stroke="black" strokeWidth="4" />
                    <polyline points="10,30 50,50 90,30" fill="none" stroke="black" strokeWidth="4" />
                    <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="4" />
                </svg>
            </ExplodingShape>

            {/* Zigzag lines */}
            <ExplodingShape
                className="bottom-32 left-10"
                animateProps={{ x: [0, 20, 0] }}
                transitionProps={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg width="120" height="40" viewBox="0 0 120 40">
                    <polyline points="0,20 20,0 40,20 60,0 80,20 100,0 120,20" fill="none" stroke="black" strokeWidth="4" />
                    <polyline points="0,40 20,20 40,40 60,20 80,40 100,20 120,40" fill="none" stroke="black" strokeWidth="4" />
                </svg>
            </ExplodingShape>

            {/* Cross Shape */}
            <ExplodingShape
                className="bottom-20 left-1/3"
                animateProps={{ rotate: [-10, 10, -10], y: [0, -10, 0] }}
                transitionProps={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <path d="M35,10 L65,10 L65,35 L90,35 L90,65 L65,65 L65,90 L35,90 L35,65 L10,65 L10,35 L35,35 Z" fill="#fcdbbd" stroke="black" strokeWidth="4" />
                    <circle cx="20" cy="50" r="2" fill="black" />
                    <circle cx="50" cy="20" r="2" fill="black" />
                    <circle cx="80" cy="50" r="2" fill="black" />
                    <circle cx="50" cy="80" r="2" fill="black" />
                    <circle cx="50" cy="50" r="2" fill="black" />
                </svg>
            </ExplodingShape>

            {/* Large Peach Rectangle */}
            <ExplodingShape
                className="top-1/4 left-10"
                animateProps={{ y: [0, 15, 0] }}
                transitionProps={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-40 h-40 bg-[#f9cbb8] border-4 border-black" />
            </ExplodingShape>

            {/* Triangle Prism */}
            <ExplodingShape
                className="top-1/3 right-1/4"
                animateProps={{ y: [0, -20, 0] }}
                transitionProps={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <polygon points="10,90 50,10 90,90" fill="#fce4d6" stroke="black" strokeWidth="4" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="black" strokeWidth="4" />
                    <line x1="10" y1="90" x2="90" y2="90" stroke="black" strokeWidth="4" />
                    <line x1="60" y1="30" x2="80" y2="70" stroke="black" strokeWidth="2" />
                    <line x1="55" y1="50" x2="70" y2="80" stroke="black" strokeWidth="2" />
                </svg>
            </ExplodingShape>
        </div>
    );
};

export default MemphisBg;
