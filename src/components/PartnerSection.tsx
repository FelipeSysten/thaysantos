import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from './Button';

const GIF_URLS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif'
];

interface Particle {
  id: number;
  x: number;
  y: number;
  url: string;
  rotation: number;
  scale: number;
  opacity: number;
}

export const PartnerSection = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const nextIdRef = useRef<number>(0);

  const spawnParticle = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastSpawnRef.current < 80) return;
    
    lastSpawnRef.current = now;
    const newParticle: Particle = {
      id: nextIdRef.current++,
      x,
      y,
      url: GIF_URLS[Math.floor(Math.random() * GIF_URLS.length)],
      rotation: Math.random() * 20 - 10,
      scale: 1,
      opacity: 1
    };

    setParticles(prev => [...prev.slice(-15), newParticle]);

    // Cleanup logic handled by animation or timeout
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spawnParticle(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <section className="w-full py-12 px-6">
      <div 
        className="relative max-w-7xl mx-auto py-48 rounded-[40px] bg-white border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden cursor-crosshair flex flex-col items-center justify-center text-center px-6"
        onMouseMove={handleMouseMove}
      >
        {/* Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute pointer-events-none transition-all duration-1000 ease-out z-10"
            style={{
              left: p.x - 100,
              top: p.y - 60,
              transform: `rotate(${p.rotation}deg) scale(0.5)`,
              opacity: 0,
              animation: 'fadeOutScale 1s forwards'
            }}
          >
            <img 
              src={p.url} 
              className="w-40 h-24 object-cover rounded-xl shadow-xl"
              alt=""
            />
          </div>
        ))}

        <h2 className="font-serif text-[48px] md:text-[64px] lg:text-[80px] leading-tight text-slate-900 mb-12 relative z-20">
          Recomece sua <span className="text-[#FF6B00] italic underline decoration-wavy">história</span>
        </h2>
        
        <Button className="relative z-20 gap-4 !px-10 !py-6 text-2xl shadow-2xl">
          <img 
            src="https://local-teal-zxrq6owhba.edgeone.app/028c7d38-ac77-41e5-97ed-e6389f84505a.jpg" 
            alt="Thay"
            className="w-14 h-14 rounded-full object-cover border-2 border-white/50 shadow-lg"
          />
          <span>RECOMEÇAR AGORA</span>
        </Button>

        <style>{`
          @keyframes fadeOutScale {
            0% { opacity: 1; transform: scale(1) rotate(var(--rotation, 0deg)); }
            100% { opacity: 0; transform: scale(0.8) rotate(var(--rotation, 0deg)); }
          }
        `}</style>
      </div>
    </section>
  );
};
