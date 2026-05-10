import { motion } from 'motion/react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';
import { Button } from './Button';

export const PricingSection = () => {
  const { ref: card1Ref } = useInViewAnimation();
  const { ref: card2Ref } = useInViewAnimation();

  return (
    <section className="w-full py-32 px-6 bg-[#FFF5F0]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Card 1 - Oferta Principal */}
        <motion.div 
          ref={card1Ref as any}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#FF6B00] rounded-[48px] p-10 md:p-16 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="font-serif text-[200px] leading-none select-none">R</span>
          </div>

          <div className="relative z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-xs font-mono mb-8 uppercase tracking-[0.2em] font-bold">Acesso Vitalício</span>
            <h3 className="text-[32px] md:text-[42px] font-bold mb-6 leading-tight">Método Recomeçar</h3>
            <p className="text-white/80 text-lg leading-relaxed mb-10">
              O guia definitivo para sair do vício e construir sua liberdade financeira online hoje mesmo.
            </p>
            
            <ul className="space-y-6 mb-12">
              <li className="flex items-center gap-4 text-base font-medium">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                Passo a passo Shopee do zero
              </li>
              <li className="flex items-center gap-4 text-base font-medium">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                Estratégias de vendas validadas
              </li>
              <li className="flex items-center gap-4 text-base font-medium">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                Suporte VIP e comunidade
              </li>
            </ul>
          </div>
          
          <div className="relative z-10">
            <div className="mb-8 p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm">
              <p className="text-xs uppercase font-bold tracking-widest opacity-60 mb-2">Garantia Blindada</p>
              <p className="text-sm font-semibold">7 dias de satisfação ou seu dinheiro de volta.</p>
            </div>
            <Button variant="tertiary" className="w-full py-5 text-xl font-bold text-[#FF6B00]">QUERO RECOMEÇAR AGORA</Button>
          </div>
        </motion.div>

        {/* Card 2 - Bônus */}
        <motion.div 
          ref={card2Ref as any}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-[48px] p-10 md:p-16 text-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.05)] flex flex-col justify-between border border-orange-100"
        >
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-mono mb-8 uppercase tracking-[0.2em] font-bold">Presente da Thay</span>
            <h3 className="text-[32px] md:text-[42px] font-bold mb-6 leading-tight">Bônus Exclusivos</h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              Aceleradores de resultados que poupam meses de tentativa e erro.
            </p>
            
            <ul className="space-y-8 mb-12">
              <li className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">🎁</div>
                <div>
                  <p className="font-bold text-lg text-slate-900">Lista de Produtos Campeões</p>
                  <p className="text-sm text-slate-500 leading-relaxed">Itens testados que vendem como água na plataforma.</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">🚀</div>
                <div>
                  <p className="font-bold text-lg text-slate-900">Estratégias de Escala 2.0</p>
                  <p className="text-sm text-slate-500 leading-relaxed">Como vender sem aparecer e converter seguidores em clientes.</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">💬</div>
                <div>
                  <p className="font-bold text-lg text-slate-900">Suporte Direto</p>
                  <p className="text-sm text-slate-500 leading-relaxed">Tire suas dúvidas e não se sinta sozinho na jornada.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></div>
              <p className="text-xs text-[#FF6B00] uppercase font-bold tracking-widest">Vagas Limitadas</p>
            </div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">As turmas são restritas para garantir a qualidade do acompanhamento individual.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
