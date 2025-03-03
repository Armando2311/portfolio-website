'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-xl font-bold"
        whileHover={{ scale: 1.05 }}
      >
        <Link href="/">
          Portfolio
        </Link>
      </motion.div>
      
      <nav>
        <ul className="flex space-x-6">
          {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
            <motion.li 
              key={item}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={`#${item.toLowerCase()}`}
                className="hover:underline underline-offset-4"
              >
                {item}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
} 