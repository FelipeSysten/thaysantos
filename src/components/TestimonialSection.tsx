import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

export const TestimonialSection = () => {
  const { ref: sectionRef } = useInViewAnimation();
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      const relativeY = rect.top + scrolled;
      const start = relativeY - viewportHeight;
      const end = relativeY + rect.height;
      
      if (scrolled > start && scrolled < end) {
        const progress = (scrolled - start) / (end - start);
        setOffset((progress - 0.5) * 150);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 flex flex-col items-center max-w-4xl mx-auto text-center overflow-hidden">
      <motion.div 
        ref={sectionRef as any} 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center"
      >
        <h2 className="text-[32px] md:text-[45px] lg:text-[54px] leading-[1.1] text-slate-900 font-bold tracking-tight mb-12">
          Existe um caminho. Um caminho onde você troca o <span className="font-serif italic text-[#FF6B00]">vício por propósito</span>.
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-12 text-left bg-orange-50/50 p-8 md:p-12 rounded-[40px] border border-orange-100">
          <motion.div 
            className="relative w-full max-w-[320px] rounded-[32px] shadow-2xl overflow-hidden aspect-[4/5] bg-white"
            style={{ 
              y: offset
            }}
          >
            <img 
              src="https://local-teal-zxrq6owhba.edgeone.app/028c7d38-ac77-41e5-97ed-e6389f84505a.jpg" 
              alt="Thay"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
          
          <div className="flex-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <p className="text-2xl font-bold text-slate-900">Prazer, eu sou Thay 👋</p>
              <p className="text-lg text-slate-600 leading-relaxed">
                E eu criei o Método Recomeçar para ajudar pessoas que querem sair do ciclo do vício e começar uma nova fase através da internet.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Hoje, usando apenas o celular, você pode aprender a gerar renda como afiliado da Shopee. Comece pequeno, mas comece de verdade.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[#FF6B00] origin-left"
            >
              <span className="w-12 h-[2px] bg-current"></span>
              <span>Propósito e Liberdade</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
