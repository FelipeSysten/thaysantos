import React from 'react';
import { motion } from 'motion/react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';
import { Button } from '../components/Button';
import { TestimonialSection } from '../components/TestimonialSection';
import { PricingSection } from '../components/PricingSection';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { ProjectsSection } from '../components/ProjectsSection';
import { PartnerSection } from '../components/PartnerSection';
import { Footer } from '../components/Footer';
import { CopyrightBar } from '../components/CopyrightBar';
import { BottomNav } from '../components/BottomNav';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MARQUEE_IMAGES = [
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1622675363203-aa6a43888365?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600'
];

const ALL_MARQUEE_IMAGES = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES];

const LandingPage: React.FC = () => {
  const { ref: heroRef } = useInViewAnimation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#FF6B00] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="flex flex-col items-center pt-12 md:pt-16 px-6">
        <motion.div 
          ref={heroRef as any} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[580px] w-full text-center"
        >
          <img 
            src="https://traditional-sapphire-dckn5ppczm.edgeone.app/e7721d0f-a7c7-4cfc-80b5-86eb48b46b21-Photoroom.png" 
            alt="Logo" 
            className="h-20 md:h-28 mx-auto mb-8"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs md:text-sm text-[#FF6B00] mb-4 uppercase tracking-[0.2em] font-bold"
          >
            Método Recomeçar by Thay
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[32px] md:text-[45px] lg:text-[54px] leading-[1.1] text-slate-900 font-bold tracking-tight mb-6"
          >
            Saia do vício em jogos e recomece sua vida construindo <span className="font-serif italic text-[#FF6B00]">renda online</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-xl text-slate-600 leading-relaxed mb-8 max-w-lg mx-auto"
          >
            Um método simples, humano e possível para quem quer mudar de vida, mesmo começando do zero e usando apenas o celular.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4"
          >
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full text-lg px-10 py-5">VER MEU PAINEL</Button>
              </Link>
            ) : (
              <Link to="/auth" className="w-full sm:w-auto">
                <Button className="w-full text-lg px-10 py-5">👉 QUERO RECOMEÇAR AGORA</Button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* 2. INFINITE MARQUEE */}
      <div className="w-full mt-16 md:mt-24 mb-16 overflow-hidden">
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {ALL_MARQUEE_IMAGES.map((src, i) => (
            <div key={i} className="flex-shrink-0 group">
              <img 
                src={src} 
                alt="" 
                className="h-[200px] md:h-[350px] w-auto max-w-none rounded-2xl shadow-md object-cover mx-2 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. CONEXÃO (Dor Real) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          <motion.h2 
            className="font-serif text-3xl md:text-5xl text-slate-900 leading-tight"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Se você está aqui, provavelmente sente que está <span className="text-[#FF6B00] italic underline decoration-wavy">perdendo tempo…</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <ul className="flex flex-col gap-5 text-lg md:text-xl text-slate-700">
              <motion.li initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span> Horas e horas em jogos
              </motion.li>
              <motion.li initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span> Sem crescimento real
              </motion.li>
              <motion.li initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span> Sem renda no bolso
              </motion.li>
              <motion.li initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-3 font-semibold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span> Sensação de estagnação
              </motion.li>
            </ul>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100"
            >
              <p className="text-lg leading-relaxed text-slate-800 mb-4">
                "Eu entendo você. Recomeçar não é uma linha reta, mas é o único caminho para a liberdade que você tanto busca."
              </p>
              <p className="font-bold text-[#FF6B00]">Recomeçar é possível.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <TestimonialSection />
      <ProjectsSection />
      <PricingSection />
      <TestimonialCarousel />
      <PartnerSection />
      <Footer />
      <CopyrightBar />
      <BottomNav />
      <div className="h-32" />
    </div>
  );
};

export default LandingPage;
