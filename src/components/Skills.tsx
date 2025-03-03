'use client';

import { motion } from 'framer-motion';

// Armando's skills data based on resume
const skillCategories = [
  {
    id: 1,
    title: 'Operating Systems',
    skills: ['Red Hat Enterprise Linux (RHEL)', 'CentOS', 'Fedora', 'Rocky Linux', 'Ubuntu', 'Debian', 'Windows', 'macOS']
  },
  {
    id: 2,
    title: 'Linux System Administration',
    skills: ['User/group management', 'System permissions', 'SELinux', 'firewalld', 'systemd services', 'Package management (dnf, yum, apt)']
  },
  {
    id: 3,
    title: 'Automation & Scripting',
    skills: ['Bash scripting', 'Python', 'Selenium', 'Automation workflows', 'System administration scripts']
  },
  {
    id: 4,
    title: 'Server Hardware',
    skills: ['Supermicro', 'Dell', 'HP enterprise servers', 'RAID configuration', 'Broadcom controllers', 'IPMI/KVM over IP', 'BIOS/firmware updates']
  },
  {
    id: 5,
    title: 'Testing & Diagnostics',
    skills: ['PassMark', 'Automated Test Equipment (ATE)', 'Hipot Testing', 'memtest86', 'Disk benchmarking', 'System logs analysis', 'Network diagnostics']
  },
  {
    id: 6,
    title: 'Networking',
    skills: ['PXE boot setup', 'VLAN configuration', 'DHCP provisioning', 'SSH key-based authentication', 'Secure file transfers', 'Network troubleshooting']
  },
  {
    id: 7,
    title: 'Virtualization & Containerization',
    skills: ['Hyper-V', 'KVM/QEMU', 'VirtualBox', 'VMware ESXi', 'Podman', 'Docker', 'Container orchestration']
  },
  {
    id: 8,
    title: 'Enterprise Software & Tools',
    skills: ['SAP ERP', 'Salesforce', 'Ansible', 'Git', 'Nagios', 'Zabbix', 'Grafana']
  }
];

export default function Skills() {
  return (
    <section id="skills" className="min-h-screen py-20 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 border-b pb-4 inline-block">Technical Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + skillIndex * 0.05 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm"
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
} 