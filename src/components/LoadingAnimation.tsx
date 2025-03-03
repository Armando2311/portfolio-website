'use client';

import { motion } from 'framer-motion';

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-16 h-16 mb-4">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="absolute top-0 left-0 w-full h-full border-2 border-white rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 1.2, 1],
                opacity: [0, 0.8, 0.2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <motion.p
          className="text-white text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading
        </motion.p>
      </motion.div>
    </div>
  );
} 