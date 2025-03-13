import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ThemeToggle from '@/components/ThemeToggle';
import Preloader from '@/components/Preloader';
import ClientCanvas from '@/components/ClientCanvas';

export default function Home() {
  return (
    <Preloader>
      <main className="relative">
        {/* 3D Background */}
        <ClientCanvas />
        
        {/* Header */}
        <Header />
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Main Content */}
        <div className="relative z-10">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
          <Footer />
        </div>
        
        {/* Scroll to Top Button */}
        <ScrollToTop />
      </main>
    </Preloader>
  );
}
