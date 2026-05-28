import React from 'react';
import { motion } from 'framer-motion';

const RoomCard = ({ roomName, createdBy }) => {
    return (
        <motion.div
            // Animation khi xuất hiện
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            // Transition khi hover (sử dụng Tailwind)
            className="bg-white border-4 border-black p-4 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
            <h3 className="text-xl font-bold font-sans text-purple-600 mb-2">{roomName}</h3>
            <p className="text-gray-600 font-medium text-sm">Tạo bởi: {createdBy}</p>
        </motion.div>
    );
};

export default RoomCard;