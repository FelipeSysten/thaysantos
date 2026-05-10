import { ArrowUpRight } from 'lucide-react';
import { Button } from './Button';

export const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 max-w-[1200px] mx-auto border-t border-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <img 
            src="https://traditional-sapphire-dckn5ppczm.edgeone.app/e7721d0f-a7c7-4cfc-80b5-86eb48b46b21-Photoroom.png" 
            alt="Logo" 
            className="h-12 mb-6"
          />
          <Button>Recomeçar Agora</Button>
        </div>

        <div className="flex flex-row gap-16 md:gap-24">
          <div className="flex flex-col gap-4 text-sm">
            <p className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Menu</p>
            <a href="#" className="text-slate-700 hover:text-[#FF6B00] transition-colors">Módulos</a>
            <a href="#" className="text-slate-700 hover:text-[#FF6B00] transition-colors">Resultados</a>
            <a href="#" className="text-slate-700 hover:text-[#FF6B00] transition-colors">Bio</a>
          </div>
          
          <div className="flex flex-col gap-4 text-sm">
            <p className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Acompanhe</p>
            <div className="flex items-center gap-1 group">
              <a href="https://instagram.com/thaires_santosss" target="_blank" rel="noopener" className="text-base text-slate-700 hover:text-[#FF6B00] transition-colors font-medium">@thaires_santosss</a>
              <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-[#FF6B00] transition-all" />
            </div>
            <div className="flex items-center gap-1 group">
              <a href="#" className="text-base text-slate-700 hover:text-[#FF6B00] transition-colors font-medium">LinkedIn</a>
              <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-[#FF6B00] transition-all" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
