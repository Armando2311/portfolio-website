'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
      <motion.h1 
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="block">Hello, I&apos;m</span>
        <span className="block mt-2">Armando R. Taveras</span>
      </motion.h1>
      
      <motion.h2 
        className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Lead Technician | Linux Systems Specialist
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="max-w-2xl"
      >
        <p className="text-gray-300 mb-8">
          Experienced Systems Technician specializing in integration, testing, configuration, and troubleshooting of Red Hat Linux-based HPC servers used for network monitoring solutions.
        </p>
        <motion.a 
          href="#about"
          className="inline-block px-8 py-3 border border-white rounded-full text-white hover:bg-white hover:text-black transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Discover More
        </motion.a>
      </motion.div>
    </section>
  );
} 