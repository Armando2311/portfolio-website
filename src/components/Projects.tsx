'use client';

import { motion } from 'framer-motion';

// Projects based on Armando's experience and skills
const projects = [
  {
    id: 1,
    title: 'Home Lab Server Infrastructure',
    description: 'Designed and implemented a comprehensive home lab environment with multiple servers for testing, learning, and certification preparation. The lab includes virtualization, containerization, and networking components.',
    technologies: ['RHEL', 'KVM/QEMU', 'Docker', 'Ansible', 'Networking'],
    image: '/placeholder.jpg',
    link: '#'
  },
  {
    id: 2,
    title: 'Bash Script Development',
    description: 'Created and maintained critical bash scripts used in production environments, including scripts to detect NIC cards and verify PCI slot detection, and scripts to automate network configuration changes instead of manual BIOS updates, saving approximately 30 minutes of testing and configuration time per server.',
    technologies: ['Bash Scripting', 'Linux', 'Networking', 'Hardware Detection', 'Process Automation'],
    image: '/placeholder.jpg',
    link: '#'
  },
  {
    id: 3,
    title: 'Rack Expansion Project Lead',
    description: 'Led a major infrastructure expansion project that increased testing capacity from 15 to 35 servers simultaneously. Managed hardware procurement, installation, configuration, and integration with existing systems to more than double testing throughput.',
    technologies: ['Project Management', 'Hardware Installation', 'Server Configuration', 'Capacity Planning', 'Infrastructure Scaling'],
    image: '/placeholder.jpg',
    link: '#'
  },
  {
    id: 4,
    title: 'Network Performance Optimization',
    description: 'Implemented network performance optimizations across server infrastructure, resulting in improved data transfer rates and reduced latency. Conducted thorough testing and benchmarking to validate improvements and ensure system stability.',
    technologies: ['Network Optimization', 'Performance Tuning', 'Benchmarking', 'Linux', 'TCP/IP'],
    image: '/placeholder.jpg',
    link: '#'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen py-20 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 border-b pb-4 inline-block">Projects & Implementations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden"
            >
              <div className="h-48 relative bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Project Image Placeholder
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="text-xs px-2 py-1 bg-white/10 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
} 