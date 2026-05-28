import { motion } from 'framer-motion';

// Bao bọc nội dung Modal bên trong thẻ này:
<motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="fixed z-50 bg-white border-4 border-black rounded-lg p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
>
    {/* Nội dung Profile Modal */}
</motion.div>