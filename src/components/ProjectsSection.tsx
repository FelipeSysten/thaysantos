import React from 'react';
import { motion } from 'motion/react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

const projects = [
  {
    id: 'mindset',
    name: 'Mentalidade e Rotina',
    description: 'Como diminuir e sair do vício em jogos, organizando sua mente para o sucesso.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'shopee',
    name: 'Domínio Shopee',
    description: 'Aprenda a começar do zero na Shopee e fazer suas primeiras vendas como afiliado.',
    image: 'https://images.unsplash.com/photo-1556742049-04ff47657f19?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'scale',
    name: 'Renda Real',
    description: 'Como transformar cliques em uma renda consistente usando apenas o seu celular.',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1000'
  }
];

export const ProjectsSection = () => {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-24 flex flex-col gap-16 md:gap-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="ml-0 md:ml-28 mb-12 max-w-2xl"
      >
        <span className="text-[#FF6B00] font-mono text-xs uppercase tracking-widest font-bold mb-4 block">Ementa do curso</span>
        <h2 className="text-[32px] md:text-[50px] font-bold text-slate-900 mb-6 leading-tight">O que você vai aprender no <span className="font-serif italic font-normal">Recomeçar</span></h2>
        <p className="text-xl text-slate-600 leading-relaxed">Um passo a passo simples e direto ao ponto que já ajudou centenas de pessoas.</p>
      </motion.div>
      {projects.map((project, index) => (
        <ProjectItem key={project.id} project={project} index={index} />
      ))}
    </section>
  );
};

interface ProjectItemProps {
  project: typeof projects[0];
  index: number;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col gap-10 w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
    >
      <div className="flex-1 w-full">
        <div className="space-y-4 md:px-12">
          <span className="text-[#FF6B00] font-serif text-3xl font-medium">0{index + 1}</span>
          <h3 className="font-bold text-3xl md:text-4xl text-slate-900">
            {project.name}
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>
      
      <div className="flex-1 w-full bg-slate-100 rounded-[40px] p-4 group">
        <div className="w-full h-[400px] md:h-[500px] rounded-[32px] shadow-2xl overflow-hidden relative">
          <img 
            src={project.image} 
            alt={project.name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 to-transparent"></div>
        </div>
      </div>
    </motion.div>
  );
};
