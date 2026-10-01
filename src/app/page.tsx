import ClientScene from '@/components/ClientScene';
import Boot from '@/components/Boot';
import Hud from '@/components/Hud';
import SmoothScroll from '@/components/SmoothScroll';
import Hero from '@/components/sections/Hero';
import { Capabilities, Profile } from '@/components/sections/Profile';
import { Line, Work } from '@/components/sections/LineWork';
import { Evidence, Toolchain } from '@/components/sections/EvidenceTools';
import { Contact } from '@/components/sections/Contact';
import { Lab } from '@/components/sections/Lab';

export default function Home() {
  return (
    <>
      <Boot />
      <SmoothScroll />
      <ClientScene />
      <div className="scene-shade pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <Hud />
      <main className="relative z-10">
        <Hero />
        <Profile />
        <Capabilities />
        <Line />
        <Work />
        <Evidence />
        <Toolchain />
        <Lab />
        <Contact />
      </main>
    </>
  );
}
