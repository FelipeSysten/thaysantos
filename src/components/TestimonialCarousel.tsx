import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

const testimonials = [
  {
    name: "Ricardo Silva",
    role: "Ex-gamer, agora Afiliado",
    text: "Eu passava 10 horas por dia no PC sem ganhar nada. O Método Recomeçar me deu o foco que eu precisava. Minha vida mudou completamente.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    name: "Ana Carla",
    role: "Mãe e Empreendedora",
    text: "Achei que era impossível aprender a vender só pelo celular. A Thay explica de um jeito tão humano que tudo ficou simples.",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    name: "Lucas Menezes",
    role: "Iniciante do Zero",
    text: "Minhas primeiras vendas na Shopee caíram em menos de 15 dias. O bônus da lista de produtos é o que faz a diferença real.",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    name: "Julia Santos",
    role: "Focada no Digital",
    text: "Sair do vício foi o maior desafio. Organizar a rotina como a Thay ensina foi a chave para eu começar a ter renda de verdade.",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    name: "Pedro Henrique",
    role: "Dono de Loja Digital",
    text: "Nunca imaginei que um método tão direto pudesse ser tão eficaz. Recomecei minha vida e hoje ajudo minha família com meu trabalho.",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
  }
];

// Tripled for infinite scroll logic
const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

export const TestimonialCarousel = () => {
  const { ref: headerRef, animationClass: headerAnim } = useInViewAnimation();
  const [currentIndex, setCurrentIndex] = useState(testimonials.length);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  // Reset to middle set if we go out of bounds to maintain infinite feel
  useEffect(() => {
    if (currentIndex >= testimonials.length * 2) {
      setTimeout(() => setCurrentIndex(testimonials.length), 800);
    } else if (currentIndex < testimonials.length) {
      setTimeout(() => setCurrentIndex(testimonials.length * 2 - 1), 800);
    }
  }, [currentIndex]);

  const cardWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? window.innerWidth - 48 : 427.5;
  const gap = 24;
  const totalOffset = currentIndex * (cardWidth + gap);

  return (
    <section className="w-full py-20 overflow-hidden bg-white">
      <div 
        ref={headerRef as any}
        className={`md:max-w-4xl md:ml-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 ${headerAnim}`}
      >
        <h2 className="text-[32px] md:text-[45px] lg:text-[54px] leading-[1.1] text-slate-900 font-bold tracking-tight">
          O que meus <span className="font-serif italic font-normal text-[#FF6B00]">alunos</span> dizem
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#FF6B00] text-[#FF6B00]" />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-900">Média 5.0</span>
        </div>
      </div>

      <div 
        className="relative px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex transition-transform duration-800"
          style={{ 
            transform: `translateX(calc(-${totalOffset}px + 50vw - ${cardWidth/2}px))`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {allTestimonials.map((t, i) => (
            <div 
              key={i}
              className="flex-shrink-0 bg-white rounded-[32px] md:rounded-[40px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-6 md:pl-10 md:pr-24 py-8 mx-3 transition-all duration-500"
              style={{ width: `${cardWidth}px` }}
            >
              <QuoteIcon className="mb-6 w-8 h-8 text-[#0D212C]" />
              <p className="text-base text-[#0D212C] leading-relaxed mb-10 min-h-[100px]">
                "{t.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-sm text-[#0D212C]">{t.name}</h4>
                  <p className="text-xs text-[#273C46] flex items-center gap-1">
                    <span className="opacity-50">→</span> {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 flex gap-4 pointer-events-none md:pointer-events-auto">
          <button 
            onClick={handlePrev}
            className="w-14 h-14 rounded-full border border-orange-200 flex items-center justify-center bg-white shadow-lg pointer-events-auto hover:bg-[#FF6B00] hover:text-white transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 flex gap-4 pointer-events-none md:pointer-events-auto">
          <button 
            onClick={handleNext}
            className="w-14 h-14 rounded-full border border-orange-200 flex items-center justify-center bg-white shadow-lg pointer-events-auto hover:bg-[#FF6B00] hover:text-white transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.3601 8 13.017 9.34315 13.017 11V15V21H14.017ZM6.01701 21L6.01701 18C6.01701 16.8954 6.91244 16 8.01701 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.01701C6.36016 8 5.01701 9.34315 5.01701 11V15V21H6.01701Z" />
  </svg>
);
