'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="min-h-screen flex flex-col justify-center py-20 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 border-b pb-4 inline-block">About Me</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-lg mb-6">
              I am a Lead Technician specializing in the assembly, configuration, and testing of high-performance Linux-based servers for network monitoring and mission-critical deployments. With extensive experience in hardware validation, system configuration, and troubleshooting, I ensure the reliability and performance of complex computing systems.
            </p>
            <p className="text-lg mb-6">
              Beyond my professional responsibilities, I maintain a fully equipped home lab with multiple servers, which serves as a testing ground for exploring emerging technologies, refining automation strategies, and enhancing system administration skills. I am currently leveraging this environment to prepare for the RHCSA certification, gaining even more hands-on experience with Red Hat Enterprise Linux.
            </p>
            <p className="text-lg">
              This continuous experimentation enables me to optimize workflows, improve system performance, and develop advanced troubleshooting capabilities that I bring to my professional work.
            </p>
            
            <div className="mt-8">
              <motion.a 
                href="/resume.pdf" 
                download
                className="inline-block px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-black transition-colors duration-300 mr-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Resume
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
              <p>Methuen, MA, 01844</p>
              <p className="text-gray-400">armandotaverash@gmail.com</p>
              <p className="text-gray-400">(475)-455-1065</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Current Position</h3>
              <p>Lead Technician, Netscout Production Line</p>
              <p className="text-gray-400">Axiomtek-US – Methuen, MA</p>
              <p className="text-gray-400">March 2024 – Present</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Assemble, configure, and test high-performance Linux-based servers</li>
                <li>Conduct hardware validation and stress testing</li>
                <li>Deploy and configure Red Hat Linux and proprietary software</li>
                <li>Develop and maintain Bash scripts for automation</li>
                <li>Build and configure RAID arrays</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
} 